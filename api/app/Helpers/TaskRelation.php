<?php
if (!function_exists('taskRelation')) {
/**
 * @param int[] $listTask : list task_id
 * @param Collection $prerequisites:
 *  $prerequisites[i]->before_tasks, $prerequisites[i]->after_tasks is task_id
 *  Ex: $pre = DB::table('pivot_table_template_tasks')->select(['after_tasks', 'before_tasks'])->get()
 * @return Array[] if there is no cycle: each element of array has format: taskID => orderIndex
 *      tasks that can start at the same time have same orderIndex
 * @return String: 'invalid' if there's a cycle
 */
    function taskRelation($listTask, $prerequisites)
    {
        $tasks = array_combine($listTask, array_fill(0, count($listTask), []));
        foreach ($prerequisites as $prerequisite) {
            $tasks[$prerequisite->after_tasks][] = $prerequisite->before_tasks;
        }

        // Create our list and visited maps
        $list = $visited = [];
        // Create a hash of colors that default to 0 (white)
        $colors = array_combine(array_keys($tasks), array_fill(0, count($listTask), 0));
        // max height of each node is also orderIndex
        $maxOrderIndex = array_combine(array_keys($tasks), array_fill(0, count($listTask), 0));

        $cycle = false;
        // Order Index: tasks which do not have dependency
        // and stay next to each other have same orderIndex
        $helper = function ($task) use (
            &$cycle,
            &$list,
            &$visited,
            &$tasks,
            &$colors,
            &$helper,
            &$maxOrderIndex
        ) {
            // If we have visited the node before, return
            if (isset($visited[$task])) {
                return;
            }

            // If this node has no dependencies, add it
            // to the list of courses we can take
            if (count($tasks[$task]) === 0) {
                $visited[$task] = true;
                $colors[$task] = 2;
                $maxOrderIndex[$task] = 0;
                $list[$task] = 0;

                return;
            }

            // Check if the node is already painted grey
            // this is used to detect cycles
            if ($colors[$task] === 1) {
                $cycle = true;

                return;
            }

            // Paint this node grey
            $colors[$task] = 1;
            // Go through the course deps and process them
            $max = -1;
            foreach ($tasks[$task] as $req) {
                $helper($req);
                if ($maxOrderIndex[$req] > $max) {
                    $max = $maxOrderIndex[$req];
                }
            }

            $max++;
            // After we are finished with this courses deps,
            // we can paint it 'black' and add it to the list
            // of courses to take.
            $colors[$task] = 2;
            // Mark as visited
            $visited[$task] = true;
            $maxOrderIndex[$task] = $max;
            // Add to list
            $list[$task] = $max;
        };

        // Go through all the courses and run the helper
        foreach ($tasks as $task => $deps) {
            $helper($task);
            if ($cycle) {
                return 'invalid';
            }
        }

        uasort($list, function ($item1, $item2) {
            if ($item1 === $item2) {
                return 0;
            }

            if ($item1 > $item2) {
                return 1;
            }

            return -1;
        });

        return $list;
    }
}
