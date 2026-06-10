Add-Type -AssemblyName System.Speech

$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$synth.SelectVoice("Microsoft Hazel Desktop")
$synth.Rate = 0

$outputDir = "public\audio"

$files = @(
    "src\data\questionBank_unitA.ts",
    "src\data\questionBank_unitB.ts",
    "src\data\questionBank_unitC.ts"
)

foreach ($file in $files)
{
    Write-Host "Processing $file"

    $content = Get-Content $file -Raw

    $matches = [regex]::Matches(
        $content,
        "id:'([^']+)'.*?audioText:'([^']+)'",
        [System.Text.RegularExpressions.RegexOptions]::Singleline
    )

    foreach ($m in $matches)
    {
        $id = $m.Groups[1].Value
        $text = $m.Groups[2].Value

        $wavPath = Join-Path $outputDir "$id.wav"

        Write-Host "Generating $id"

        $synth.SetOutputToWaveFile($wavPath)
        $synth.Speak($text)
    }
}

$synth.Dispose()

Write-Host "DONE"