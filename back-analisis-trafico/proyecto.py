import cv2
import numpy as np
from ultralytics import YOLO

# Cargar el modelo YOLO
model = YOLO("yolov8n.pt")

# Clases objetivo: persona (0), carro (2), moto (3)
target_classes = [0, 2, 3]

# Abrir el video
cap = cv2.VideoCapture('videoTrafico.mp4')

while True:
    ret, frame = cap.read()
    if not ret:
        break

    h, w, _ = frame.shape
    roi = frame[int(h * 0.):h, :]

    results = model(roi, conf=0.15)[0]

    count_person = 0
    count_car = 0
    count_moto = 0

    for result in results.boxes:
        cls = int(result.cls[0])
        if cls in target_classes:
            x1, y1, x2, y2 = map(int, result.xyxy[0])

            # Etiquetas en español
            if cls == 0:
                label = "Peaton"
                count_person += 1
            elif cls == 2:
                label = "Carro"
                count_car += 1
                width_expand = int((x2 - x1) * 0.15)
                x1 = max(0, x1 - width_expand)
                x2 = min(w, x2 + width_expand)
            elif cls == 3:
                label = "Moto"
                count_moto += 1

            cv2.rectangle(roi, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(roi, label, (x1, y1 - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

    # Mostrar el video principal
    cv2.imshow("Deteccion de trafico", frame)

    # Ventana informativa
    total_vehiculos = count_car + count_moto
    if total_vehiculos >= 10:
        estado_trafico = "ALTO"
        color = (0, 0, 255)
    elif total_vehiculos >= 5:
        estado_trafico = "MEDIO"
        color = (0, 255, 255)
    else:
        estado_trafico = "BAJO"
        color = (0, 255, 0)

    info_window = np.zeros((150, 300, 3), dtype=np.uint8)
    cv2.putText(info_window, f'Trafico: {estado_trafico}', (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, color, 2)
    cv2.putText(info_window, f'Carros: {count_car}', (10, 70), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (200,200,200), 1)
    cv2.putText(info_window, f'Motos: {count_moto}', (10, 100), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (200,200,200), 1)
    cv2.putText(info_window, f'Peatones: {count_person}', (10, 130), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (200,200,200), 1)
    cv2.imshow('Condiciones del trafico', info_window)

    # Salida con ESC
    if cv2.waitKey(1) & 0xFF == 27:
        break

cap.release()
cv2.destroyAllWindows()

