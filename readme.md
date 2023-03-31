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

<!-- # Block
1. DOM 遍历 主优先级  
2. 识别率  
1.1 媒体 + 政府  
1.2 | 特殊符号 中英文混合，极容易符号不正确  
3. 句柄 
2.1 搜索的当时查询句柄  
- 实现的时候，可以实现数次查询  
2.2 使用其它方式
C:\Users\mhjlw\AppData\Roaming\Tencent\WeChat\XPlugin\Plugins\RadiumWMPF
C:\Users\mhjlw\Documents\WeChat Files\

https://res.servicewechat.com/weapp/release_encrypt/67_j8haCXeJ4m2g4oy-vxYDuSo3CVRGfO9l8vgofit3LtIzBchSaRbjtxY0BSiWgjKSklf3_fapJcni7y3n.zstd?rand=431658695&pass_key=F_59qnc8L8Ooba3VBe3FtRRSVK3wJY0w1cwfiUmMhYYyKV10gQH0MV8KLbxbLjBDg-FIdQNCQf_Nwk-A0GG4fkZwOAf5ay3PiMFhE8xKN5FLvT-Qg6BioehWUqth3qcbWgc5bGtJChllzPnqFB46hZlKUowqyyfHn2i7pcPuxY_pDHLnfsxS0ipHhzn4UC6wHdr9r87yTb459r2ogKvuJCHOPZm6D5LPLHbf3TRwAoA~&ext_code=9FOCBxd7R4XiAgpUN_6jUe0LUn1ZCWAE7hG_ALv-tTE
-->