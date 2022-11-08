<?php
if (!function_exists('orderTaskByMilestone')) {
    function orderMilestonesByPeriod(&$listMilestone)
    {
        $listMilestone = $listMilestone->sort(function ($milestone1, $milestone2) {
            $numDates1 = $milestone1->is_week ? $milestone1->period * 7
            : $milestone1->period;
            $numDates2 = $milestone2->is_week ? $milestone2->period * 7
            : $milestone2->period;
            if ($numDates1 === $numDates2) {
                return 0;
            }

            if ($numDates1 < $numDates2) {
                return -1;
            }

            return 1;
        });
    }
}
