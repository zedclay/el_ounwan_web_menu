<!DOCTYPE html>
<html lang="ar" dir="rtl">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>العنوان • el ounwan | Coffee shop • Eatery</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
            href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&family=Be+Vietnam+Pro:wght@400;500;600&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
            rel="stylesheet"
        />
        @if (file_exists(public_path('hot')))
            @viteReactRefresh
        @endif
        @vite(['resources/css/app.css', 'resources/js/app.jsx'])
    </head>
    <body>
        <div id="root"></div>
    </body>
</html>
