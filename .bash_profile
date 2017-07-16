function amobile() {
  local COMMAND_NAME
  local SCRIPT_DIR

  # -- helper functions
  function varName {
      # everything to upper case and dash to underscore
      echo ${1//-/_} | tr '[:lower:]' '[:upper:]'
  }

  # setVar(varName, varValue)
  function setVar {
    eval "$1=\"$2\""
  }

  function init {
    echo "cordova aurelia app initialization"

    mkdir -p "www"
    mkdir -p "platforms"
    mkdir -p "plugins"

    npm install

    cordova prepare
  }

  function runAndroid {
    echo "start app on android emulator"

    rm -rf ./www/*

    npm start -- build
    cordova run android
  }

  function runIos {
   echo "start app on ios emulator"

   rm -rf ./www/*
  }

  SCRIPT_DIR=$(pwd)
  COMMAND_NAME=$(varName "$@")

  case "$COMMAND_NAME" in
    INIT)
        init
      ;;

    RUN_ANDROID)
        runAndroid
      ;;

    RUN_IOS)
        runIos
      ;;

    *) echo "invalid command"
      ;;
  esac
}
