# Controle Financeiro - Android WebView App

Este é um aplicativo de controle financeiro que utiliza WebView para renderizar uma interface web moderna no Android.

## Estrutura do Projeto

```
android/
  ├── app/
  │   ├── src/
  │   │   ├── main/
  │   │   │   ├── java/com/controle/financeiro/
  │   │   │   │   ├── MainActivity.java
  │   │   │   │   └── WebViewClient.java
  │   │   │   ├── res/
  │   │   │   │   ├── layout/
  │   │   │   │   │   └── activity_main.xml
  │   │   │   │   └── values/
  │   │   │   │       ├── colors.xml
  │   │   │   │       └── strings.xml
  │   │   │   └── AndroidManifest.xml
  │   │   └── assets/
  │   │       └── www/  # Next.js static export files go here
  │   └── build.gradle
  └── build.gradle
```

## Instruções de Configuração

1. Build do Next.js para produção:
```bash
npm run build
```

2. Copie o conteúdo da pasta 'out' para 'android/app/src/main/assets/www/'

3. Abra o projeto no Android Studio:
- Importe a pasta 'android'
- Aguarde a sincronização do Gradle
- Execute o aplicativo

## Configurações do WebView

O WebView está configurado para:
- Suporte a JavaScript
- Acesso ao LocalStorage
- Gestos de toque otimizados
- Cache habilitado
- Modo de visualização otimizado para mobile

## Permissões Necessárias

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

## Build do Aplicativo

1. Gere o arquivo APK:
   - Build > Generate Signed Bundle/APK
   - Selecione APK
   - Siga as instruções para criar/selecionar uma keystore
   - Escolha a variante de release
   - O APK será gerado em app/release/

2. Instale o APK no dispositivo Android

## Notas de Desenvolvimento

- O aplicativo usa uma WebView customizada para melhor integração com o sistema Android
- O armazenamento local (localStorage) é persistido entre sessões
- A interface foi otimizada para touch e gestos mobile
- O tema segue as cores padrão do WhatsApp para familiaridade
