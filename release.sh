#!/bin/bash

version=`cat manifest.json | jq .version | tr -d \"`
rm -f tbcommander*.xpi
zip -r "tbcommander-${version}.xpi" tbcommander* manifest.json icons -x\*~
