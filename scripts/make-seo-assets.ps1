Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot

# --- OG cover 1200x630 ---
$bmp = New-Object System.Drawing.Bitmap 1200, 630
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = 'AntiAlias'
$g.TextRenderingHint = 'AntiAlias'
$g.Clear([System.Drawing.Color]::FromArgb(255, 12, 12, 15))

$rectA = New-Object System.Drawing.Rectangle(700, -150, 700, 700)
$brA = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rectA, [System.Drawing.Color]::FromArgb(70, 108, 99, 255), [System.Drawing.Color]::FromArgb(0, 12, 12, 15), 45)
$g.FillEllipse($brA, $rectA)
$rectB = New-Object System.Drawing.Rectangle(-200, 350, 600, 600)
$brB = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rectB, [System.Drawing.Color]::FromArgb(55, 255, 101, 132), [System.Drawing.Color]::FromArgb(0, 12, 12, 15), 225)
$g.FillEllipse($brB, $rectB)

$lineRect = New-Object System.Drawing.Rectangle(90, 402, 380, 6)
$brLine = New-Object System.Drawing.Drawing2D.LinearGradientBrush($lineRect, [System.Drawing.Color]::FromArgb(255, 108, 99, 255), [System.Drawing.Color]::FromArgb(255, 255, 101, 132), 0)
$g.FillRectangle($brLine, $lineRect)

$white = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$soft = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(210, 255, 255, 255))
$muted = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(120, 255, 255, 255))
$accent = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 155, 148, 255))

$fBrand = New-Object System.Drawing.Font('Segoe UI', 76, [System.Drawing.FontStyle]::Bold)
$fSub = New-Object System.Drawing.Font('Segoe UI', 34, [System.Drawing.FontStyle]::Regular)
$fSmall = New-Object System.Drawing.Font('Segoe UI', 22, [System.Drawing.FontStyle]::Regular)
$fEyebrow = New-Object System.Drawing.Font('Segoe UI', 24, [System.Drawing.FontStyle]::Bold)

$g.DrawString('ВЕБ-АГЕНТСТВО', $fEyebrow, $accent, 85, 150)
$g.DrawString('Antares', $fBrand, $white, 75, 195)
$g.DrawString('Сайты и Telegram-боты под ключ', $fSub, $soft, 82, 440)
$g.DrawString('Малый бизнес · Молдова и СНГ · проект за 5–7 дней', $fSmall, $muted, 85, 520)

$bmp.Save((Join-Path $root 'images\og-cover.png'), [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose(); $bmp.Dispose()

# --- Apple touch icon 180x180 ---
$icon = New-Object System.Drawing.Bitmap 180, 180
$gi = [System.Drawing.Graphics]::FromImage($icon)
$gi.SmoothingMode = 'AntiAlias'
$gi.TextRenderingHint = 'AntiAlias'
$gi.Clear([System.Drawing.Color]::FromArgb(255, 12, 12, 15))
$rectI = New-Object System.Drawing.Rectangle(0, 0, 180, 180)
$brI = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rectI, [System.Drawing.Color]::FromArgb(255, 108, 99, 255), [System.Drawing.Color]::FromArgb(255, 255, 101, 132), 45)
$fIcon = New-Object System.Drawing.Font('Segoe UI', 62, [System.Drawing.FontStyle]::Bold)
$fmt = New-Object System.Drawing.StringFormat
$fmt.Alignment = 'Center'; $fmt.LineAlignment = 'Center'
$gi.DrawString('A', $fIcon, $brI, (New-Object System.Drawing.RectangleF(0, 4, 180, 180)), $fmt)
$icon.Save((Join-Path $root 'images\apple-touch-icon.png'), [System.Drawing.Imaging.ImageFormat]::Png)
$gi.Dispose(); $icon.Dispose()
Write-Output 'OK'
