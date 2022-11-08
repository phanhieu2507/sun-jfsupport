#!/bin/bash

yq_version=3.4.1

function load_yq {
    local arch

    if [[ x`uname` == xDarwin ]]; then
        arch=darwin_amd64
    else
        arch=linux_amd64
    fi

    download_binary yq https://github.com/mikefarah/yq $yq_version yq_$arch
}
