$env:PATH = "C:\Users\Usuario\AppData\Roaming\npm;C:\Program Files\nodejs;" + $env:PATH
Set-Location "C:\Users\Usuario\Desktop\Claude\backend"
& "C:\Program Files\nodejs\npx.cmd" prisma init 2>&1
