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
                (360 / count) * index
        })
    );
}

export default function NodeControls({
    nodes,
    setNodes
}) {

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

    return (

        <div
            className="
                bg-zinc-900
                border border-zinc-800
                rounded-3xl
                p-6
            "
        >

            <h2 className="text-2xl font-bold mb-5">
                Cluster Controls
            </h2>

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
                    className="
                        bg-green-500
                        hover:scale-105
                        transition
                        px-5 py-3
                        rounded-2xl
                        font-semibold
                        text-black
                        w-full
                        sm:w-auto
                    "
                >
                    Add Node
                </button>

                <button
                    onClick={removeNode}
                    className="
                        bg-red-500
                        hover:scale-105
                        transition
                        px-5 py-3
                        rounded-2xl
                        font-semibold
                        text-black
                        w-full
                        sm:w-auto
                    "
                >
                    Remove Node
                </button>

            </div>

        </div>
    );
}