$env:PATH = "C:\Users\Usuario\AppData\Roaming\npm;C:\Program Files\nodejs;" + $env:PATH
Set-Location "C:\Users\Usuario\Desktop\Claude"
& "C:\Users\Usuario\AppData\Roaming\npm\nest.cmd" new backend --package-manager npm --skip-git
