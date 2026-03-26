$env:PATH = "C:\Users\Usuario\AppData\Roaming\npm;C:\Program Files\nodejs;" + $env:PATH
Set-Location "C:\Users\Usuario\Desktop\Claude\backend"
& "C:\Program Files\nodejs\npm.cmd" install @prisma/adapter-pg pg 2>&1
& "C:\Program Files\nodejs\npm.cmd" install --save-dev @types/pg 2>&1
