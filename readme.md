# mpAnalyzer
Scan miniprogram to catch datas through network and UI by DOM traversal and image recognition.
# Prepare
## 0. Enviroment
- A Windows server is needed.
- Install Wechat PC Version using default setup path.
- Node version < 17, since the winappdriver's `windows: click` etc. doesn't support 17+
## 1. Setup OpenCV
### 1.1 Download OpenCV
You could download and unzip it to `mpAnalyzer\lib\`  
https://opencv.org/releases/
### 1.2 Add OpenCV to PATH
Add Path to System Varialbes:
```shell
Name: OPENCV_BIN_DIR
Value: {Your Path}\mpAnalyzer\lib\opencv\build\x64\vc16\bin
```
like this:
![System Varialbes](https://s2.loli.net/2023/03/18/GocNPpKHSrs5wMu.png)

## 2. Install Appium
*@next* is needed, we need Appium 2.x
```shell
npm install -g appium@next
```
## 3. Install Drivers
### 3.1 winappdriver
#### ① Donwload and Install WinAppDriver
https://github.com/microsoft/WinAppDriver/releases/tag/v1.2.1  
Notes:
- Don't try the newset version, *1.2.1* is needed 
- Set "ms:experimental-webdriver" to false to ignore some errors  
#### ② Install appium-windows-driver
```shell
appium driver install --source=npm appium-windows-driver
```
### 3.2 appium-chromium-driver
#### ① Reinstall npm
It is needed to make npm ready for chromium-driver
```shell
npm install -g npm  
```
#### ② Install appium-chromium-driver
Please enable the global proxy to ensure the download is successful
```shell
appium driver install chromium
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
## Run server
```shell
npm run server
```
## Do task
### Scan a miniprogram online using keywords or name
```shell
npm start {Miniprogram Name} / {Keywords}
```
# Documents  
- [appium-windows-driver](https://github.com/appium/appium-windows-driver)  
- [appium-chromium-driver](https://github.com/appium/appium-chromium-driver)  
- [Webdriver API](https://webdriver.io/docs/api)  