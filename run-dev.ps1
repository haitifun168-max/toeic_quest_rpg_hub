$nodeDir = "C:\Users\user\node-v22\node-v22.13.0-win-x64"
$npmDir = "C:\Users\user\AppData\Roaming\npm"
$env:PATH = $nodeDir + ";" + $npmDir + ";" + $env:PATH
npm run dev
