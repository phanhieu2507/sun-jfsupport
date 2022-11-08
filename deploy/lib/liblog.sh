#!/bin/bash

function load_log {
    true
}

function info {
	printf "\r  [ \033[00;34m..\033[0m ] $1\n"
}

function user {
	printf "\r  [ \033[0;33m??\033[0m ] $1 "
}

function success {
	printf "\r\033[2K  [ \033[00;32mOK\033[0m ] $1\n"
}

function error {
	printf "\r\033[2K  [\033[0;31mERROR\033[0m] $1\n"
}

function fatal {
	printf "\r\033[2K  [\033[0;31mFATAL\033[0m] $1\n"
	echo ''
	exit 1
}
