import { useMemo } from "react";

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
                (360 / count) * index +
                Math.random() * 10
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

export default function HashRing({
    nodes
}) {

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

    return (


        <div
            className="
                bg-zinc-900
                border border-zinc-800
                rounded-3xl
                p-6
            "
        >

            <h2 className="text-2xl font-bold mb-8">
                Consistent Hash Ring
            </h2>

            <div
                className="
                    relative
                    w-[600px]
                    h-[600px]
                    mx-auto
                    rounded-full
                    border-4
                    border-zinc-700
                "
            >
                <svg
                    className="
        absolute
        inset-0
        w-full
        h-full
        -rotate-90
    "
                >

                    {

                        vnodes.map((vnode, index) => {

                            const previous =
                                vnodes[
                                (
                                    index - 1 +
                                    vnodes.length
                                ) % vnodes.length
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

                            const radius = 240;

                            const startX =
                                300 +
                                radius *
                                Math.cos(
                                    (Math.PI / 180)
                                    * startAngle
                                );

                            const startY =
                                300 +
                                radius *
                                Math.sin(
                                    (Math.PI / 180)
                                    * startAngle
                                );

                            const endX =
                                300 +
                                radius *
                                Math.cos(
                                    (Math.PI / 180)
                                    * endAngle
                                );

                            const endY =
                                300 +
                                radius *
                                Math.sin(
                                    (Math.PI / 180)
                                    * endAngle
                                );

                            return (

                                <path
                                    key={vnode.vnodeId}
                                    d={`
                        M ${startX} ${startY}
                        A ${radius} ${radius}
                        0 ${largeArc} 1
                        ${endX} ${endY}
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
                                vnodes.map(v => ({
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
                                        w-4
                                        h-4
                                        rounded-full
                                        shadow-lg
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

                {

                    vnodes.map((vnode) => {

                        const position =
                            angleToPosition(
                                vnode.angle - 8,
                                48
                            );

                        return (

                            <div
                                key={vnode.vnodeId}
                                className="
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
                                        bg-green-500
                                        text-black
                                        px-5
                                        py-3
                                        rounded-2xl
                                        font-bold
                                        shadow-lg
                                        whitespace-nowrap
                                        min-w-[120px]
                                        text-center
                                    "
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

                    nodes.map((node) => (

                        <div
                            key={node.name}
                            className="
                    flex
                    items-center
                    gap-3
                    bg-zinc-800
                    px-4
                    py-2
                    rounded-2xl
                "
                        >

                            <div
                                className="
                        w-4
                        h-4
                        rounded-full
                    "
                                style={{
                                    backgroundColor:
                                        nodeColorMap[
                                        node.name
                                        ]
                                }}
                            />

                            <span className="font-medium">
                                {node.name}
                            </span>

                        </div>
                    ))
                }

            </div>

        </div>
    );
}