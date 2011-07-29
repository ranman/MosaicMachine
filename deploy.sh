#!/usr/bin/env bash
HOST=50.17.215.235
if [ -z $1 ]; then
    echo "test or prod?"
    exit
elif [ $1 = "test" ]; then
    HOST_PATH="~/html/test/"
elif [ $1 = "prod" ]; then
    HOST_PATH="~/html/"
fi
echo `scp * ec2-user@$HOST:$HOST_PATH`
