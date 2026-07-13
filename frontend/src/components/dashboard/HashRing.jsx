import {
    useMemo,
    useState,
    useEffect
} from "react";

const colorPalette = [
    "#4ade80",
    "#c084fc",
    "#fb923c",
    "#f472b6",
    "#22d3ee",
    "#facc15",
    "#60a5fa",
    "#f87171"
];

function polarToCartesian(
    angle,
    radius,
    center
) {

    const radians =
        (angle - 90)
        * (Math.PI / 180);

    return {

        x:
            center +
            radius * Math.cos(radians),

        y:
            center +
            radius * Math.sin(radians)
    };
}

function generateVirtualNodes(
    nodes,
    virtualCount = 3
) {

    const vnodes = [];

    const totalVnodes =
        nodes.length * virtualCount;

    let currentIndex = 0;

    for (
        let vnodeIndex = 0;
        vnodeIndex < virtualCount;
        vnodeIndex++
    ) {

        for (
            let nodeIndex = 0;
            nodeIndex < nodes.length;
            nodeIndex++
        ) {

            const node =
                nodes[nodeIndex];

            const angle =
                (
                    currentIndex *
                    (
                        360 /
                        totalVnodes
                    )
                );

            vnodes.push({

                physicalNode:
                    node.name,

                vnodeId:
                    `${node.name}-V${vnodeIndex + 1}`,

                angle
            });

            currentIndex++;
        }
    }

    return vnodes;
}

function buildNodeColorMap(nodes) {

    const map = {};

    nodes.forEach((node, index) => {

        map[node.name] =
            colorPalette[
            index % colorPalette.length
            ];
    });

    return map;
}

function generateUrls(count) {

    return Array.from(
        { length: count },
        (_, index) => ({
            id: `URL-${index + 1}`,

            angle:
                Math.random() * 360
        })
    );
}

function angleToPosition(
    angle,
    radius = 48
) {

    const radians =
        (angle - 90)
        * (Math.PI / 180);

    return {
        x:
            50 +
            radius * Math.cos(radians),

        y:
            50 +
            radius * Math.sin(radians)
    };
}

function assignNode(
    urlAngle,
    nodes
) {

    const sorted =
        [...nodes]
            .sort(
                (a, b) =>
                    a.angle - b.angle
            );

    for (const node of sorted) {

        if (urlAngle <= node.angle) {
            return node.name;
        }
    }

    return sorted[0].name;
}

function generateNodeName(index) {

    let name = "";

    index++;

    while (index > 0) {

        index--;

        name =
            String.fromCharCode(
                65 + (index % 26)
            ) + name;

        index =
            Math.floor(index / 26);
    }

    return `Node-${name}`;
}

function generateNodes(count) {

    return Array.from(
        { length: count },
        (_, index) => ({

            name:
                generateNodeName(index),

            angle:
                (360 / count) * index,
            
            failed: false
        })
    );
}

export default function HashRing({
    nodes,
    setNodes,
    liveUrls = [],
    darkMode
}) {
    function toggleNodeStatus(name) {
        setNodes(prev => prev.map(node => {
            if (node.name === name) {
                return { ...node, failed: !node.failed };
            }
            return node;
        }));
    }

    function addNode() {

        setNodes(
            generateNodes(
                nodes.length + 1
            )
        );
    }

    function removeNode() {

        if (nodes.length <= 1) {
            return;
        }

        setNodes(
            generateNodes(
                nodes.length - 1
            )
        );
    }
    const [isMobile, setIsMobile] =
        useState(
            () => window.innerWidth < 768
        );

    useEffect(() => {

        function handleResize() {

            setIsMobile(
                window.innerWidth < 768
            );

        }

        window.addEventListener(
            "resize",
            handleResize
        );

        return () => {

            window.removeEventListener(
                "resize",
                handleResize
            );

        };

    }, []);

    const ringSize =
        isMobile
            ? 320
            : 600;

    const center =
        ringSize / 2;

    const radius =
        ringSize * 0.4;

    const urls = useMemo(
        () => generateUrls(100),
        []
    );

    const nodeColorMap =
        buildNodeColorMap(nodes);

    const vnodes =
        generateVirtualNodes(
            nodes,
            3
        );

    // Compute active virtual nodes for routing rebalancing
    const routingVnodes = useMemo(() => {
        const active = vnodes.filter(v => {
            const physical = nodes.find(n => n.name === v.physicalNode);
            return physical && !physical.failed;
        });
        const sorted = active.length > 0 ? active : vnodes;
        return [...sorted].sort((a, b) => a.angle - b.angle);
    }, [vnodes, nodes]);

    // Map live visitor shortened URLs to stable angles using stable string hashing
    const getUrlAngle = (shortCode) => {
        let sum = 0;
        for (let i = 0; i < shortCode.length; i++) {
            sum += shortCode.charCodeAt(i) * (i + 1);
        }
        return sum % 360;
    };

    const liveUrlDots = useMemo(() => {
        return liveUrls.map((url) => {
            const angle = getUrlAngle(url.shortCode);
            return {
                id: `LIVE-${url.shortCode}`,
                shortCode: url.shortCode,
                angle: angle,
                clicks: url.clicks || 0
            };
        });
    }, [liveUrls]);

    return (


        <div
            className={`
                border rounded-3xl p-8 transition-colors duration-300
                ${darkMode ? "bg-zinc-900 border-zinc-800 text-white shadow-2xl backdrop-blur-lg" : "bg-white border-zinc-200 text-zinc-900 shadow-md"}
            `}
        >

            <h2 className="text-2xl font-bold mb-1">
                Consistent Hash Ring
            </h2>

            <p className={`${darkMode ? "text-zinc-500" : "text-zinc-400"} text-xs sm:text-sm mb-8`}>
                Interactive simulation — use Add/Remove Node to see rebalancing; take shards offline to simulate node failure and see ranges fail over.
            </p>

            <div
                className={`
                    relative
                    mx-auto
                    rounded-full
                    border-4
                    transition-colors duration-300
                    ${darkMode ? "border-zinc-800" : "border-zinc-200 shadow-inner bg-zinc-50"}
                `}
                style={{
                    width: `${ringSize}px`,
                    height: `${ringSize}px`
                }}
            >
                <svg
                    viewBox={`0 0 ${ringSize} ${ringSize}`}
                    className="
                        absolute
                        inset-0
                        w-full
                        h-full
                        z-0
                    "
                >

                    {

                        routingVnodes.map((vnode, index) => {

                            const previous =
                                routingVnodes[
                                (
                                    index - 1 +
                                    routingVnodes.length
                                ) % routingVnodes.length
                                ];

                            const startAngle =
                                previous.angle;

                            const endAngle =
                                vnode.angle < startAngle
                                    ? vnode.angle + 360
                                    : vnode.angle;

                            const largeArc =
                                endAngle - startAngle > 180
                                    ? 1
                                    : 0;

                            const start =
                                polarToCartesian(
                                    startAngle,
                                    radius,
                                    center
                                );

                            const end =
                                polarToCartesian(
                                    endAngle,
                                    radius,
                                    center
                                );
                            
                            

                            return (

                                <path
                                    key={vnode.vnodeId}
                                    d={`
                                        M ${start.x} ${start.y}
                                        A ${radius} ${radius}
                                        0 ${largeArc} 1
                                        ${end.x} ${end.y}
                                    `}
                                    stroke={
                                        nodeColorMap[
                                        vnode.physicalNode
                                        ]
                                    }
                                    strokeWidth="10"
                                    fill="none"
                                    opacity="0.8"
                                    strokeLinecap="round"
                                />
                            );
                        })
                    }

                </svg>

                {

                    urls.map((url) => {

                        const position =
                            angleToPosition(
                                url.angle,
                                34
                            );

                        const vnodeOwner =
                            assignNode(
                                url.angle,
                                routingVnodes.map(v => ({
                                    name: v.vnodeId,
                                    angle: v.angle
                                }))
                            );

                        const vnode =
                            vnodes.find(
                                v =>
                                    v.vnodeId === vnodeOwner
                            );

                        const owner =
                            vnode.physicalNode;

                        return (

                            <div
                                key={url.id}
                                className="
                                    absolute
                                    -translate-x-1/2
                                    -translate-y-1/2
                                    z-10
                                    transition-all
                                    duration-500
                                "
                                style={{
                                    left:
                                        `${position.x}%`,
                                    top:
                                        `${position.y}%`
                                }}
                            >

                                <div
                                    className="
                                        w-3
                                        h-3
                                        rounded-full
                                        shadow-lg
                                        transition-colors duration-500
                                    "
                                    style={{
                                        backgroundColor:
                                            nodeColorMap[owner]
                                    }}
                                    title={`${url.id} → ${owner}`}
                                />

                            </div>
                        );
                    })
                }

                {/* Live URL Animations */}
                {

                    liveUrlDots.map((url) => {

                        const position =
                            angleToPosition(
                                url.angle,
                                34
                            );

                        const vnodeOwner =
                            assignNode(
                                url.angle,
                                routingVnodes.map(v => ({
                                    name: v.vnodeId,
                                    angle: v.angle
                                }))
                            );

                        const vnode =
                            vnodes.find(
                                v =>
                                    v.vnodeId === vnodeOwner
                            );

                        const owner =
                            vnode.physicalNode;
                            
                        const color = nodeColorMap[owner];

                        return (

                            <div
                                key={url.id}
                                className="
                                    absolute
                                    -translate-x-1/2
                                    -translate-y-1/2
                                    z-30
                                    transition-all
                                    duration-500
                                "
                                style={{
                                    left:
                                        `${position.x}%`,
                                    top:
                                        `${position.y}%`
                                }}
                            >

                                <div
                                    className="
                                        w-6
                                        h-6
                                        rounded-full
                                        relative
                                        flex
                                        items-center
                                        justify-center
                                        group
                                        cursor-pointer
                                    "
                                >
                                    {/* Pulse Animation Ring */}
                                    <span 
                                        className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                                        style={{ backgroundColor: color }}
                                    />
                                    
                                    {/* Actual Inner Dot */}
                                    <span 
                                        className="relative inline-flex rounded-full h-3.5 w-3.5 shadow-lg border border-white/40"
                                        style={{ backgroundColor: color }}
                                    />
                                    
                                    {/* Tooltip on Hover */}
                                    <div className="absolute bottom-7 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center bg-zinc-950/95 border border-zinc-800 text-[10px] px-2.5 py-1.5 rounded-lg whitespace-nowrap z-50 text-white shadow-2xl">
                                        <p className="font-bold text-blue-400">/r/{url.shortCode}</p>
                                        <p className="text-zinc-300 text-[9px] mt-0.5 font-medium">Clicks: {url.clicks}</p>
                                        <p className="text-zinc-500 text-[9px]">Shard: {owner}</p>
                                    </div>
                                </div>

                            </div>
                        );
                    })
                }

                {

                    vnodes.map((vnode) => {

                        const position =
                            angleToPosition(
                                vnode.angle - 8,
                                48
                            );

                        const physical = nodes.find(n => n.name === vnode.physicalNode);
                        const isFailed = physical ? physical.failed : false;

                        return (

                            <div
                                key={vnode.vnodeId}
                                className="
                                    hidden
                                    md:block
                                    absolute
                                    -translate-x-1/2
                                    -translate-y-1/2
                                    z-20
                                    transition-all
                                    duration-500
                                "
                                style={{
                                    left:
                                        `${position.x}%`,
                                    top:
                                        `${position.y}%`
                                }}
                            >

                                <div
                                    className="
                                        text-black
                                        rounded-2xl
                                        font-bold
                                        shadow-lg
                                        whitespace-nowrap
                                        px-2
                                        py-1
                                        text-xs
                                        min-w-17.5
                                        sm:px-5
                                        sm:py-3
                                        sm:text-base
                                        sm:min-w-30
                                        text-center
                                        transition-all duration-300
                                    "
                                    style={{
                                        backgroundColor: isFailed ? (darkMode ? "#27272a" : "#e4e4e7") : (nodeColorMap[vnode.physicalNode] || "#10b981"),
                                        color: isFailed ? (darkMode ? "#52525b" : "#a1a1aa") : "#000000",
                                        opacity: isFailed ? 0.4 : 1,
                                        border: isFailed ? (darkMode ? "1px dashed #3f3f46" : "1px dashed #cbd5e1") : "none"
                                    }}
                                >

                                    {vnode.vnodeId}

                                </div>

                            </div>
                        );
                    })
                }

            </div>

            <div
                className="
                mt-10
                flex
                flex-wrap
                gap-4
                justify-center
                "
            >

                {

                    nodes.map((node) => {
                        const isFailed = node.failed;
                        return (
                            <div
                                key={node.name}
                                className={`
                                    flex
                                    items-center
                                    gap-3
                                    border
                                    px-4
                                    py-2
                                    rounded-2xl
                                    transition-colors duration-300
                                    ${darkMode 
                                        ? "bg-zinc-800 border-zinc-700 text-white" 
                                        : "bg-zinc-100 border-zinc-200 text-zinc-900 shadow-sm"}
                                `}
                            >

                                <div
                                    className="
                                        w-4
                                        h-4
                                        rounded-full
                                        transition-all
                                    "
                                    style={{
                                        backgroundColor: isFailed ? (darkMode ? "#3f3f46" : "#cbd5e1") : nodeColorMap[node.name],
                                        opacity: isFailed ? 0.4 : 1
                                    }}
                                />

                                <span className={`font-semibold ${isFailed ? "line-through text-zinc-500" : ""}`}>
                                    {node.name}
                                </span>

                                <button
                                    onClick={() => toggleNodeStatus(node.name)}
                                    className={`
                                        ml-2 px-2.5 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer
                                        ${isFailed 
                                            ? "bg-rose-500/20 text-rose-400 border-rose-500/30 hover:bg-rose-500/30" 
                                            : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30"}
                                    `}
                                    title={isFailed ? "Click to Activate Shard" : "Click to Take Shard Offline"}
                                >
                                    {isFailed ? "Offline" : "Active"}
                                </button>

                            </div>
                        );
                    })
                }

            </div>

            <div
                className={`
                    mt-8
                    pt-6
                    border-t
                    transition-colors duration-300
                    ${darkMode ? "border-zinc-800 text-white" : "border-zinc-200 text-zinc-900"}
                `}
            >

                <h3
                    className="
            text-xl
            font-bold
            mb-4
        "
                >
                    Cluster Controls
                </h3>

                <div
                    className="
            flex
            flex-col
            sm:flex-row
            gap-4
        "
                >

                    <button
                        onClick={addNode}
                        className={`
                            hover:scale-105 transition px-5 py-3 rounded-2xl font-semibold w-full sm:w-auto cursor-pointer
                            ${darkMode ? "bg-white text-black hover:bg-zinc-200" : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"}
                        `}
                    >
                        Add Node
                    </button>

                    <button
                        onClick={removeNode}
                        className={`
                            hover:scale-105 transition px-5 py-3 rounded-2xl font-semibold w-full sm:w-auto cursor-pointer
                            ${darkMode ? "bg-red-500 text-black hover:bg-red-400" : "bg-rose-600 text-white hover:bg-rose-700 shadow-sm"}
                        `}
                    >
                        Remove Node
                    </button>

                </div>

            </div>

        </div>
    );
}