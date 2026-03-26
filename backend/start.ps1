$env:PATH = "C:\Users\Usuario\AppData\Roaming\npm;C:\Program Files\nodejs;" + $env:PATH
Set-Location "C:\Users\Usuario\Desktop\Claude\backend"
& "C:\Program Files\nodejs\npm.cmd" run start:dev 2>&1
