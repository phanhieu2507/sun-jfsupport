<?php

use Illuminate\Support\Str;

if (!function_exists('convertMarkdown')) {
    function convertMarkdown($markdown)
    {
        if (!$markdown) {
            return $markdown;
        }

        $descriptionOfDetail = Str::markdown($markdown);
        $descriptionOfDetail = str_replace('<li><input checked="" disabled="" type="checkbox">', '<ul data-checked="true"><li>', $descriptionOfDetail);
        $descriptionOfDetail = str_replace('<li><input disabled="" type="checkbox">', '<ul data-checked="false"><li>', $descriptionOfDetail);
        $descriptionOfDetail = str_replace('</li>', '</li></ul>', $descriptionOfDetail);

        return $descriptionOfDetail;
    }
}
