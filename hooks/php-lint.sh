#!/bin/sh

PROJECT="$(git rev-parse --show-toplevel)"
STAGED_FILES_CMD=`git diff --cached --name-only --diff-filter=ACMR HEAD | grep \\\\.php`

# Determine if a file list is passed
if [ "$#" -eq 1 ]
then
	oIFS=$IFS
	IFS='
	'
	SFILES="$1"
	IFS=$oIFS
fi
SFILES=${SFILES:-$STAGED_FILES_CMD}

echo "Checking PHP Lint..."
for FILE in $SFILES
do
	php -l -d display_errors=0 $PROJECT/$FILE
	if [ $? != 0 ]
	then
		echo "Fix the error before commit."
		exit 1
	fi
	FILES="$FILES $PROJECT/$FILE"
done

if [ "$FILES" != "" ]
then
	echo "Running Code Sniffer..."
	./vendor/bin/phpcs --standard=PSR2 -n -p $FILES
	if [ $? != 0 ]
	then
		echo "Fix the error before commit."
		exit 1
	fi
fi

exit $?
