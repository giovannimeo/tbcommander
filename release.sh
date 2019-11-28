#!/bin/bash

rm -f tbsearchui.xpi
zip -r tbsearchui.xpi tbsearchui* manifest.json icons -x\*~
