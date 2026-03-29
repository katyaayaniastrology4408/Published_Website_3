$sendTime = (Get-Date).AddHours(1).ToString("HH:mm")
$nodePath = (Get-Command node).Source
$scriptPath = (Resolve-Path "scripts/send-grahan-now.mjs").Path
$workDir = (Get-Location).Path
$action = New-ScheduledTaskAction -Execute $nodePath -Argument $scriptPath -WorkingDirectory $workDir
$trigger = New-ScheduledTaskTrigger -Once -At $sendTime
Register-ScheduledTask -TaskName "GrahanEmailSend" -Action $action -Trigger $trigger -Force -RunLevel Highest | Out-Null
Write-Host "Scheduled for $sendTime"
