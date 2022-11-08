#!/bin/bash

ansible_version=2.9.14

require log

function load_ansible {
    if [ -z $(get_binary ansible-playbook) ]; then
        fatal "Ansible is not installed"
    fi
}
