#!/bin/bash

require yq

ytt_version=v0.30.0

function load_ytt {
    local arch

    if [[ x`uname` == xDarwin ]]; then
        arch=darwin-amd64
    else
        arch=linux-amd64
    fi

    download_binary ytt https://github.com/vmware-tanzu/carvel-ytt $ytt_version ytt-$arch
}

function tpl {
    tmp_values="$BASE_DIR/values.tmp.yml"
    cat << EOF | tee $tmp_values
#@data/values
---
EOF
    cmd yq m -xP "$BASE_DIR/values.default.yml" $1 >> $tmp_values
    cmd ytt -f $tmp_values -f "$TEMPLATES_DIR/$2" "${@:3}"
    rm $tmp_values
}
