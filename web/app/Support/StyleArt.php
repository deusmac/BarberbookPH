<?php

namespace App\Support;

/** Flat hairstyle reference illustrations (inline SVG). Ported from the prototype. */
class StyleArt
{
    private const DEFS = [
    "midtaper" => [
        "top" => "M46 60 C38 24 122 24 114 60 C106 48 54 48 46 60 Z",
        "sides" => [
            "M46 60 L46 90 L55 90 L55 54 Z",
            "M114 60 L114 90 L105 90 L105 54 Z"
        ]
    ],
    "lowfade" => [
        "top" => "M46 54 C40 22 120 22 114 54 C108 44 52 44 46 54 Z",
        "sides" => [
            "M46 54 L46 104 L56 104 L56 48 Z",
            "M114 54 L114 104 L104 104 L104 48 Z"
        ]
    ],
    "highfade" => [
        "top" => "M56 26 C60 12 100 12 104 26 L106 40 C92 34 68 34 54 40 Z",
        "sides" => [
            "M46 58 L46 22 L58 22 L56 58 Z",
            "M114 58 L114 22 L102 22 L104 58 Z"
        ]
    ],
    "twoblock" => [
        "top" => "M46 46 L46 30 C46 18 114 18 114 30 L114 46 C100 40 60 40 46 46 Z",
        "sides" => [
            "M46 46 L46 74 L54 74 L54 46 Z",
            "M114 46 L114 74 L106 74 L106 46 Z"
        ]
    ],
    "fringe" => [
        "top" => "M46 60 C40 24 120 24 114 60 L110 46 L100 56 L92 42 L82 54 L72 42 L62 56 L52 44 Z"
    ],
    "frenchcrop" => [
        "top" => "M48 50 C46 30 114 30 112 50 C104 42 90 46 84 40 C76 46 60 42 48 50 Z"
    ],
    "buzz" => [
        "top" => "M47 50 C45 36 115 36 113 50 C100 44 60 44 47 50 Z",
        "fill" => "#4B5563"
    ],
    "crew" => [
        "top" => "M46 56 L46 36 C46 28 114 28 114 36 L114 56 C104 48 56 48 46 56 Z",
        "fill" => "#1F2937"
    ],
    "sidepart" => [
        "top" => "M46 56 C42 26 122 22 114 56 C108 40 92 34 78 36 C66 38 56 42 46 56 Z",
        "part" => "M70 36 L62 50"
    ],
    "pompadour" => [
        "top" => "M44 56 C30 18 60 2 80 4 C104 2 130 18 116 56 C106 40 54 40 44 56 Z"
    ],
    "mullet" => [
        "back" => [
            "M42 50 L32 124 L48 128 L52 60 Z",
            "M118 50 L128 124 L112 128 L108 60 Z"
        ],
        "top" => "M47 52 C46 30 114 30 113 52 C100 44 60 44 47 52 Z"
    ],
    "kids" => [
        "top" => "M46 62 C40 24 120 24 114 62 L114 50 C104 38 56 38 46 50 Z",
        "small" => true
    ],
    "generic" => [
        "top" => "M48 56 C46 32 114 32 112 56 C104 46 56 46 48 56 Z"
    ]
];

    public static function svg(?string $art, string $label = "Hairstyle"): string
    {
        $def = self::DEFS[$art ?? ""] ?? self::DEFS["generic"];
        $shape = fn (string $d, string $fill) => "<path d=\"{$d}\" fill=\"{$fill}\" stroke=\"#000\" stroke-width=\"3\" stroke-linejoin=\"round\"/>";
        $back = implode("", array_map(fn ($d) => $shape($d, "#111"), $def["back"] ?? []));
        $sides = implode("", array_map(fn ($d) => $shape($d, "#6B7280"), $def["sides"] ?? []));
        $part = isset($def["part"]) ? "<path d=\"{$def["part"]}\" fill=\"none\" stroke=\"#fff\" stroke-width=\"2.5\" stroke-linecap=\"round\"/>" : "";
        $skin = "#F5D0B0";
        $figure = $shape("M20 160 C20 128 46 116 80 116 C114 116 140 128 140 160 Z", "#fff")
            . "<rect x=\"68\" y=\"102\" width=\"24\" height=\"20\" fill=\"{$skin}\" stroke=\"#000\" stroke-width=\"3\"/>"
            . "<ellipse cx=\"48\" cy=\"78\" rx=\"6\" ry=\"9\" fill=\"{$skin}\" stroke=\"#000\" stroke-width=\"3\"/>"
            . "<ellipse cx=\"112\" cy=\"78\" rx=\"6\" ry=\"9\" fill=\"{$skin}\" stroke=\"#000\" stroke-width=\"3\"/>"
            . "<ellipse cx=\"80\" cy=\"72\" rx=\"32\" ry=\"38\" fill=\"{$skin}\" stroke=\"#000\" stroke-width=\"3\"/>"
            . $sides . $shape($def["top"], $def["fill"] ?? "#111") . $part
            . "<circle cx=\"68\" cy=\"74\" r=\"2.8\" fill=\"#000\"/><circle cx=\"92\" cy=\"74\" r=\"2.8\" fill=\"#000\"/>"
            . "<path d=\"M70 91 Q80 98 90 91\" fill=\"none\" stroke=\"#000\" stroke-width=\"2.5\" stroke-linecap=\"round\"/>";
        $inner = ! empty($def["small"]) ? "<g transform=\"translate(16 20) scale(0.8)\">{$figure}</g>" : $figure;
        $label = htmlspecialchars($label, ENT_QUOTES);

        return "<svg viewBox=\"0 0 160 160\" width=\"160\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"{$label} reference image\"><rect width=\"160\" height=\"160\" fill=\"#E2F1F8\"/>{$back}{$inner}</svg>";
    }
}
