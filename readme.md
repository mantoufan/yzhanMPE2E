# YZhanMPE2E
Testing WeChat Mini Programs end-to-end using BFS, packet capture, file monitoring and image recognition to obtain elements, network requests, wxapkg. Automatically handle auth and interaction pop-ups.
# Prepare
## 0. Enviroment
- A Windows server is needed.
- Install Wechat PC Version using default setup path.
- Node version < 17, since the winappdriver's `windows: click` etc. doesn't support 17+
## 1. Setup OpenCV
### 1.1 Download OpenCV
You could download and unzip it to `yzhanMPE2E\lib\`  
https://opencv.org/releases/
### 1.2 Add OpenCV to PATH
Add Path to System Varialbes:
```shell
Name: OPENCV_BIN_DIR
Value: {Your Path}\yzhanMPE2E\lib\opencv\build\x64\vc16\bin
```
like this:
![System Varialbes](https://s2.loli.net/2023/05/13/8QWsBTIDPVAq7ni.jpg)

## 2. Install Appium
*@next* is needed, we need Appium 2.x
```shell
npm install -g appium@next
```
## 3. Install Drivers
### 3.1 Donwload and Install WinAppDriver
https://github.com/microsoft/WinAppDriver/releases/tag/v1.2.1  
Notes:
- Don't try the newset version, *1.2.1* is needed 
- Set "ms:experimental-webdriver" to false to ignore some errors  
### 3.2 Install appium-windows-driver
```shell
appium driver install --source=npm appium-windows-driver
```

# Install
Please make sure your node version is < 17  
```
nvm use
```
```shell
npm install
```

# Usage
## Run Server
```shell
npm run server
```
## Run Client
### Scan a miniprogram online using keywords or name
```shell
npm start {Miniprogram Name} / {Keywords}
```
### Run a proxy with the declared port
```shell
npm run proxy 7890
```
### Run a monitor with the declared folder
```shell
npm run watch "C:\Users\mhjlw\Documents\WeChat Files\Applet"
```
### Run Unit Test
```shell
npm test
```
# Documents  
- [appium-windows-driver](https://github.com/appium/appium-windows-driver)   
- [Webdriver API](https://webdriver.io/docs/api)  
- [Windows User32 API](https://github.com/waitingsong/node-win32-api/blob/main/packages/win32-api/src/lib/user32/api.ts)