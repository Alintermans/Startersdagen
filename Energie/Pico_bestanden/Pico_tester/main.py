from machine import Pin, DAC, I2C
import ssd1306  
import time

# Setup OLED display
WIDTH =128 
HEIGHT= 64
i2c=I2C(0,scl=Pin(1),sda=Pin(0),freq=200000)
oled = SSD1306_I2C(WIDTH,HEIGHT,i2c)

dac = DAC(Pin(25))

# Setup buttons
button_increase = Pin(14, Pin.IN, Pin.PULL_UP)  
button_decrease = Pin(12, Pin.IN, Pin.PULL_UP)  


# Initial voltage level (starting at 0V)
voltage_step = 0.1
current_voltage = 0.0

def update_display(voltage):
    oled.fill(0)
    oled.text("Voltage Level:", 0, 0)
    oled.text("{:.1f} V".format(voltage), 0, 16)
    oled.show()

def set_voltage(voltage):
    # Convert voltage (0-3.3V) to 8-bit DAC value (0-255)
    dac_value = int((voltage / 3.3) * 255)
    dac.write(dac_value)

def loop():
    global current_voltage
    while True:
        if not button_increase.value():
            if current_voltage + voltage_step <= 3.3:
                current_voltage += voltage_step
                set_voltage(current_voltage)
                update_display(current_voltage)
            time.sleep(0.2)  # Debounce delay
        
        if not button_decrease.value():
            if current_voltage - voltage_step >= 0.0:
                current_voltage -= voltage_step
                set_voltage(current_voltage)
                update_display(current_voltage)
            time.sleep(0.2)  # Debounce delay
        
        time.sleep(0.1)

# Initialize display
update_display(current_voltage)

# Start main loop
loop()
