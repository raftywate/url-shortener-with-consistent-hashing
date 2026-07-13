const autocannon = require('autocannon');

async function runBenchmark() {
    console.log("Preparing benchmark: generating test short URLs...");
    
    // We will shorten 10 distinct URLs to get a selection of short codes
    const targetUrls = Array.from({ length: 10 }, (_, i) => `https://benchmark-target-${i}-${Math.random()}.com/page`);
    const shortCodes = [];

    for (const url of targetUrls) {
        try {
            const response = await fetch('http://localhost:8080/shorten', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });
            if (response.ok) {
                const code = await response.text();
                shortCodes.push(code);
                console.log(`  Shortened ${url} -> ${code}`);
            } else {
                console.error(`  Failed to shorten ${url}: ${response.statusText}`);
            }
        } catch (err) {
            console.error(`  Failed to connect to backend for shortening: ${err.message}`);
        }
    }

    if (shortCodes.length === 0) {
        console.error("No short codes could be generated. Make sure the backend is running at http://localhost:8080.");
        process.exit(1);
    }

    console.log(`Successfully generated ${shortCodes.length} short codes. Starting load test...`);

    const instance = autocannon({
        url: 'http://localhost:8080',
        connections: 500, // Concurrency target from instructions
        duration: 20,     // Run for 20 seconds
        requests: [
            {
                method: 'GET',
                setupRequest: (req) => {
                    const code = shortCodes[Math.floor(Math.random() * shortCodes.length)];
                    req.path = `/r/${code}`;
                    return req;
                }
            }
        ]
    }, (err, result) => {
        if (err) {
            console.error("Autocannon error:", err);
            process.exit(1);
        }
        
        console.log("\n================ BENCHMARK RESULTS ================");
        console.log(`Active Connections: ${result.connections}`);
        console.log(`Duration:           ${result.duration} seconds`);
        console.log(`Total Requests:     ${result.requests.total}`);
        console.log(`Requests/sec:       ${result.requests.average.toFixed(2)}`);
        console.log(`Transfer:           ${(result.throughput.average / 1024 / 1024).toFixed(2)} MB/sec`);
        console.log("\nLatency Distribution:");
        console.log(`  p50 (Average):    ${result.latency.p50} ms`);
        console.log(`  p90:              ${result.latency.p90} ms`);
        console.log(`  p95:              ${result.latency.p95} ms`);
        console.log(`  p99:              ${result.latency.p99} ms`);
        console.log("===================================================\n");
        process.exit(0);
    });

    autocannon.track(instance, { renderProgressBar: true });
}

runBenchmark().catch(console.error);
