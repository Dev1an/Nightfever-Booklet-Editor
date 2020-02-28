#!/bin/sh

#  build-client.sh
#  
#
#  Created by Damiaan on 28/02/2020.
#  

set -eu
here="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd "$here/editor"
node ../meteor-build-client/main.js "$here/docs" -p ""
