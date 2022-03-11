#!/bin/bash

# <customize>
DYALOG="/Applications/Dyalog-18.0.app/Contents/Resources/Dyalog/mapl"
PORT="8008"
# </customize>

# CREDIT: https://stackoverflow.com/a/246128/11108026
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

if ! command -v websocketd &> /dev/null
then
    echo "Please install websocketd: https://github.com/joewalnes/websocketd#download"
    exit
fi

CMD="$DYALOG -script $SCRIPT_DIR/repl.apl"
echo -e "alias apl_repl=\"$CMD\"\n"
echo "Running apl_repl on a websocket connected to ws://localhost:$PORT"
echo -e "Test it on the devconsole here: http://localhost:$PORT\n"

stty -echo
eval "websocketd --devconsole --loglevel=fatal --port=$PORT $CMD"