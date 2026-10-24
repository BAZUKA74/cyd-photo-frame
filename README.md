<div align="center">

![CYD PhotoFrame](cyd-photoframe-hero.png)

# CYD PhotoFrame

### Turn a tiny ESP32 touchscreen into a wireless photo frame and live drawing display.

[![Latest release](https://img.shields.io/github/v/release/BAZUKA74/cyd-photo-frame?style=for-the-badge&color=1688f0)](https://github.com/BAZUKA74/cyd-photo-frame/releases/latest)
[![STABLE](https://img.shields.io/badge/channel-STABLE-22c55e?style=for-the-badge)](https://github.com/BAZUKA74/cyd-photo-frame/releases/latest)
[![Android 5+](https://img.shields.io/badge/Android-5.0%2B-3DDC84?style=for-the-badge&logo=android&logoColor=white)](https://github.com/BAZUKA74/cyd-photo-frame/releases/latest)
[![ESP32](https://img.shields.io/badge/ESP32-HW--458-E7352C?style=for-the-badge&logo=espressif&logoColor=white)](#supported-hardware)
[![License](https://img.shields.io/badge/source-open-ffd028?style=for-the-badge)](#source-code)

**English** · [Русский](README_RU.md) · **[Download APK](https://github.com/BAZUKA74/cyd-photo-frame/releases/latest)**

</div>

---

## What it does

CYD PhotoFrame connects an Android phone directly to an **ESP32-2432S028 / HW-458** over Wi-Fi. The phone prepares media for the board's limited memory, uploads it, and can also draw on the display in real time.

| Media & playback | Drawing & controls | Device experience |
|---|---|---|
| Photos, GIF and MP4 import | Smooth LIVE brush over Wi-Fi | Touchscreen menu |
| Automatic 320×240 conversion | Lines, rectangles, circles and triangles | Rotation and screen-fit modes |
| Compact GIF optimization | Outline and filled shapes | Manual and automatic brightness |
| Full-screen scaling and cropping | Movable text and text animation | Russian and English interface |
| On-device photo storage | Image or animated-canvas export | Update checks through GitHub Releases |

## Quick start

1. Download and install the **[latest Android APK](https://github.com/BAZUKA74/cyd-photo-frame/releases/latest)**.
2. Power the ESP32 board and connect the phone to the `CYD-PhotoFrame` Wi-Fi network.
3. Open the app, select a photo, GIF, MP4, or the drawing editor.
4. Choose rotation and screen fitting, then tap **Prepare and send**.

> [!TIP]
> The app automatically selects Russian or English from the phone language. Open the black app menu to switch languages manually.

## LIVE drawing

Draw on the phone and see the result immediately on the ESP32 display. The editor includes:

- smooth brush strokes with selectable width and color;
- straight lines, rectangles, circles, and triangles;
- outline or solid color fill;
- movable and resizable text;
- still-image and animated GIF export;
- the proven original LIVE transmission algorithm.

## Supported hardware

The ready-to-flash binaries target:

| Component | Supported configuration |
|---|---|
| Board | ESP32-2432S028 / HW-458 |
| Display | 2.8-inch, 320×240 |
| ESP module | ESP32 N4-class, 4 MB Flash |
| Connection | Direct Wi-Fi access point |
| Android | Android 5.0 and newer |

> [!CAUTION]
> Similar-looking boards can use different display controllers, pinouts, touch controllers, backlight circuits, or Flash layouts. **Do not flash the provided BIN onto another model blindly.** Read [ADAPTATION.md](ADAPTATION.md) and build a board-specific image.

## Adaptation for other boards / Адаптация под другие платы

The ready-made BIN is built specifically for **ESP32-2432S028 / HW-458**. If your board is different, the source code can be adapted instead of starting from scratch. Usually you need to change:

- display, touch, backlight, and SD-card pins;
- display and touch controller drivers;
- screen resolution, rotation, Flash, and PSRAM settings;
- the PlatformIO board profile and partition layout.

Готовый BIN предназначен именно для **ESP32-2432S028 / HW-458**. Для другой платы исходный код можно адаптировать: поменять пины, драйверы экрана и тача, разрешение, настройки Flash/PSRAM и профиль PlatformIO.

**[Русская инструкция по адаптации →](ADAPTATION_RU.md)** · **[English adaptation guide →](ADAPTATION.md)**

> [!IMPORTANT]
> Before flashing another board, make a Flash backup and verify its exact model. You can give the adaptation guide, board photos, and markings to an AI assistant and ask it to prepare the required configuration, but always check the resulting pinout before flashing.

## Downloads

All current files are in **[GitHub Releases](https://github.com/BAZUKA74/cyd-photo-frame/releases/latest)**:

- signed universal Android APK;
- application-only ESP32 firmware image;
- complete ESP32 Flash image;
- full Android and firmware source archive.

The application checks GitHub Releases for updates from its black menu.

## Release channels

| Version | Channel | Meaning |
|---|---|---|
| `v1.0`–`v1.19` | **BETA** | Development and testing releases. |
| `v2.0` and newer | **STABLE** | Tested releases intended for everyday use. |

The current recommended version is **v2.0 STABLE**. Beta releases use the **`[BETA]`** prefix and stable releases use **`[STABLE]`**.

## Source code

- `android/` — Android application source;
- `firmware/` — PlatformIO firmware project;
- [ADAPTATION.md](ADAPTATION.md) — porting guide for other ESP32 boards;
- [README_RU.md](README_RU.md) — Russian documentation.

The private Android signing key is intentionally excluded. Keep the original key safe: Android updates must be signed with the same key as the installed application.

## Safety

- Back up the board's original Flash before experimenting.
- Verify the exact board revision and pinout before flashing.
- Disconnect batteries while soldering or changing wiring.
- Never connect a bare Li-ion/LiPo cell directly unless the board has a suitable charger and protection circuit.

## Contributing

Bug reports, hardware-port notes, and improvements are welcome. When requesting support for another board, include clear photos of both sides, full markings, controller models, pinout, Flash/PSRAM size, and the build or upload log.

<div align="center">

Made for tiny screens, colorful pixels, and delightfully overpowered photo frames.

</div>
