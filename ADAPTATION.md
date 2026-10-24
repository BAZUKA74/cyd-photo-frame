# Adapting the firmware to another board

**English** · [Русский](ADAPTATION_RU.md)

This project is configured for the **ESP32-2432S028 / HW-458** with a 320×240 display.

Another board may use different hardware:

- ESP32 variant and Flash/PSRAM capacity;
- display controller, such as ILI9341 or ST7789;
- screen resolution and orientation;
- `MOSI`, `MISO`, `SCLK`, `CS`, `DC`, `RST`, and backlight pins;
- touchscreen controller and pinout;
- photoresistor, microSD slot, and power circuit.

## Information to provide when asking AI to port the project

Attach clear photos of both sides of the board and provide:

1. the complete board and ESP module markings;
2. the display and touchscreen controller models;
3. a verified pinout or a link to the schematic;
4. the Flash size and whether PSRAM is available;
5. the screen resolution and desired orientation;
6. the build or upload log if an error occurs.

Example prompt:

> Adapt the CYD PhotoFrame project to my board. Keep the network protocol and application features unchanged. First verify the display controller, resolution, memory capacity, and complete pinout. Then update the PlatformIO configuration and firmware. Do not suggest flashing the HW-458 binary directly.

## Safe porting procedure

1. Read and save a complete backup of the board's original Flash contents.
2. Verify the supply voltage and GPIO logic levels.
3. Build a minimal test that fills the screen with a single color.
4. Test the touchscreen, backlight, and sensors.
5. Only then add Wi-Fi, GIF playback, and LIVE drawing.

The provided binary files are intended only for the specified hardware revision. For another board, adapt the source and build a dedicated firmware image.
