!macro customInstall
  DetailPrint "Register electron URI Handler"
  DeleteRegKey HKCR "electron"
  WriteRegStr HKCR "electron" "" "URL:electron"
  WriteRegStr HKCR "electron" "URL Protocol" ""
  WriteRegStr HKCR "electron\DefaultIcon" "" "$INSTDIR\${APP_EXECUTABLE_FILENAME}"
  WriteRegStr HKCR "electron\shell" "" ""
  WriteRegStr HKCR "electron\shell\Open" "" ""
  WriteRegStr HKCR "electron\shell\Open\command" "" "$INSTDIR\${APP_EXECUTABLE_FILENAME} %1"
!macroend