#!/bin/bash

#
# I like to quickly
# and capricously
# throw away code
# so this script is fun
#
# and dirty, so use it
# at your own risk
#
# (2018.12.05) \0

function list_staged(){

    echo $( git status -s | sed -n -e 's/[AM]\+ //p' )
}

function list_modifications_on_tracked(){

    echo $( git status -s | sed -n -e 's/ M//p' )
}

git reset HEAD $( list_staged | xargs )
git checkout -- $( list_modifications_on_tracked | xargs )
