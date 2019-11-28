#!/bin/bash

version=`cat manifest.json | jq .version | tr -d \"`
rm -f tbsearchui*.xpi
zip -r "tbsearchui-${version}.xpi" tbsearchui* manifest.json icons -x\*~
