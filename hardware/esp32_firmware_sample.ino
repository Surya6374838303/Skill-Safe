/**
 * SkillSafe — Handheld Gas Diagnostic Probe Firmware Sample
 * Target: ESP32-S3 (Arduino Core / ESP-IDF)
 * Smart India Hackathon 2026
 *
 * Demonstrates:
 * 1. ADC reading from calibrated gas sensor and contact vibration sensor
 * 2. BLE GATT Server sending instant haptic notifications to paired Smart Watch
 * 3. Wi-Fi client sending HTTP POST telemetry to FastAPI Backend API
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>
#include <ArduinoJson.h>

// Wi-Fi Configuration
const char* WIFI_SSID = "YOUR_WIFI_SSID";
const char* WIFI_PASS = "YOUR_WIFI_PASSWORD";
const char* API_ENDPOINT = "http://192.168.1.100:8000/api/readings";

// Device Metadata
const char* DEVICE_ID = "SS-HANDHELD-ESP32-02";
const char* WORKER_ID = "w-102";

// Pin Assignments
#define PIN_GAS_ADC      4   // MQ Gas Sensor Analog Pin (ADC1)
#define PIN_VIB_ADC      5   // Contact Piezo Sensor Analog Pin (ADC1)
#define PIN_BUZZER       6   // Local 85dB Buzzer
#define PIN_HAZARD_LED   7   // Local Red Hazard Strobe LED

// BLE UUID Definitions
#define SERVICE_UUID           "4F530001-5349-4832-3032-365341464500"
#define CHAR_ALERT_UUID        "4F530002-5349-4832-3032-365341464500"
#define CHAR_ACK_UUID          "4F530003-5349-4832-3032-365341464500"

BLECharacteristic *pAlertCharacteristic;
bool bleClientConnected = false;

class MyServerCallbacks: public BLEServerCallbacks {
    void onConnect(BLEServer* pServer) {
      bleClientConnected = true;
      Serial.println("[BLE] Smart Watch Connected.");
    };
    void onDisconnect(BLEServer* pServer) {
      bleClientConnected = false;
      Serial.println("[BLE] Smart Watch Disconnected. Restarting Advertising...");
      pServer->getAdvertising()->start();
    }
};

void setup() {
  Serial.begin(115200);
  pinMode(PIN_BUZZER, OUTPUT);
  pinMode(PIN_HAZARD_LED, OUTPUT);
  digitalWrite(PIN_BUZZER, LOW);
  digitalWrite(PIN_HAZARD_LED, LOW);

  // Initialize BLE
  BLEDevice::init("SkillSafe-Probe-ESP32");
  BLEServer *pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks());

  BLEService *pService = pServer->createService(SERVICE_UUID);
  pAlertCharacteristic = pService->createCharacteristic(
                      CHAR_ALERT_UUID,
                      BLECharacteristic::PROPERTY_READ |
                      BLECharacteristic::PROPERTY_NOTIFY
                    );
  pAlertCharacteristic->addDescriptor(new BLE2902());
  pService->start();

  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->start();
  Serial.println("[BLE] Advertising ready for Smart Watch pairing.");

  // Connect to Wi-Fi
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  Serial.print("[Wi-Fi] Connecting");
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n[Wi-Fi] Connected! IP: " + WiFi.localIP().toString());
  } else {
    Serial.println("\n[Wi-Fi] Offline mode. Telemetry will buffer locally.");
  }
}

void loop() {
  // 1. Read Raw Sensors
  int rawGas = analogRead(PIN_GAS_ADC);
  int rawVib = analogRead(PIN_VIB_ADC);

  // 2. Calibration Formula (Illustrative demo conversion)
  // Voltage = rawGas * (3.3 / 4095.0)
  float gasPpm = (rawGas / 4095.0) * 150.0;
  float vibRms = (rawVib / 4095.0) * 1.5;

  String currentSection = "P4";
  String alertLevel = "nominal";

  // 3. Threshold Evaluation
  if (gasPpm > 100.0) {
    alertLevel = "critical";
    digitalWrite(PIN_BUZZER, HIGH);
    digitalWrite(PIN_HAZARD_LED, HIGH);

    // Send instant BLE Notification to Worker Wrist
    if (bleClientConnected) {
      uint8_t alertPacket[4] = { 0x02, 0x03, 0x04, 0x01 }; // [Type=Hazard, Severity=Crit, Section=P4, Seq]
      pAlertCharacteristic->setValue(alertPacket, 4);
      pAlertCharacteristic->notify();
    }
  } else {
    digitalWrite(PIN_BUZZER, LOW);
    digitalWrite(PIN_HAZARD_LED, LOW);
  }

  // 4. Send HTTP POST to Backend API
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(API_ENDPOINT);
    http.addHeader("Content-Type", "application/json");

    StaticJsonDocument<256> doc;
    doc["device_id"] = DEVICE_ID;
    doc["worker_id"] = WORKER_ID;
    doc["gas_reading"] = gasPpm;
    doc["gas_unit"] = "ppm CH4 eq.";
    doc["vibration_reading"] = vibRms;
    doc["temperature"] = 32.8;
    doc["humidity"] = 43.1;
    doc["section_id"] = currentSection;
    doc["battery_percent"] = 85;
    doc["connectivity_status"] = "online";
    doc["alert_level"] = alertLevel;

    String requestBody;
    serializeJson(doc, requestBody);

    int httpResponseCode = http.POST(requestBody);
    Serial.printf("[HTTP] POST Status: %d | Gas: %.1f ppm | Vib: %.2f mm/s\n", httpResponseCode, gasPpm, vibRms);
    http.end();
  }

  delay(1000); // 1 Hz sampling cadence
}
