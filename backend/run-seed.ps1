$env:PATH = "C:\Users\Usuario\AppData\Roaming\npm;C:\Program Files\nodejs;" + $env:PATH
Set-Location "C:\Users\Usuario\Desktop\Claude\backend"
Write-Host "Generando cliente Prisma..."
& "C:\Program Files\nodejs\npx.cmd" prisma generate 2>&1
Write-Host ""
Write-Host "Ejecutando seed..."
& "C:\Program Files\nodejs\npm.cmd" run seed 2>&1
