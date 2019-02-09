#!/bin/bash

function exit_if_var_missing(){

    if [ -z $1 ]
    then

	echo 'missing required environment variable; build aborted.'
	exit 2;
    fi
}

exit_if_var_missing $TEMPLATE_PATH
exit_if_var_missing $OUTPUT_PATH
exit_if_var_missing $STYLES_GLOB


bundlefile='app/app.js'
bundle_head='bundle_head.js'
bundle_main='bundle_main.js'
bundle_tail='bundle_tail.js'

scripts=$(cat './manifest.txt')
cat $scripts > "$bundle_main"

echo '(function(){ ' > "$bundle_head"
echo '}());' > "$bundle_tail"
cat "$bundle_head" "$bundle_main" "$bundle_tail" > "$bundlefile"

rm -f "$bundle_head" "$bundle_main" "$bundle_tail"

this_commit=$(git log -n 1 --format=%H)
build_hash_pattern='||build_hash||'

tmp_page='app/tmp.html'
rm -f $tmp_page

sed -e "s/$build_hash_pattern/$this_commit/g" $TEMPLATE_PATH > $tmp_page

cp $tmp_page $OUTPUT_PATH
rm $tmp_page

cp $STYLES_GLOB $( dirname $OUTPUT_PATH )
