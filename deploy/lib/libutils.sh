#!/bin/bash

export BASE_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." >/dev/null 2>&1 && pwd )"
export LIB_DIR="$BASE_DIR/lib"
export BIN_DIR="$BASE_DIR/bin"
export TEMPLATES_DIR="$BASE_DIR/templates"

function download {
    local dl_bin

    if [ -x "$(command -v wget)" ]; then
        dl_bin="wget -qO-"
    else
        dl_bin="curl -fsSL"
    fi

    $dl_bin "$1"
}

function download_binary {
    local binary=$1
    local github_repo=$2
    local version=$3
    local download_name=$4

    local local_binary="$LIB_DIR/../bin/$binary"

    if [ ! -x "$local_binary" ] && [ ! -x "$(command -v $binary)" ]; then
        echo "Downloading $download_name..."

        mkdir -p "$LIB_DIR/../bin"
        download "$github_repo/releases/download/$version/$download_name" > "$local_binary"
        chmod +x "$local_binary"
    fi
}

function get_binary {
    local local_binary="$LIB_DIR/../bin/$1"

    if [ -x "$local_binary" ]; then
        echo "$local_binary"
    else
        echo "$(command -v $1)"
    fi
}

function cmd {
    "$(get_binary $1)" "${@:2}"
}

function require {
    local lib

    for lib in "$@"; do
        source "$LIB_DIR/lib$lib.sh"
        "load_$lib"
    done
}
