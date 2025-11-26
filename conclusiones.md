# ✍️ Conclusiones del Ejercicio de Pruebas: Fakestore - Módulo de Login

## 📊 Análisis de Resultados de la Prueba de Carga k6

Los resultados proporcionados por k6, del escenario de prueba de carga fue exitoso y cumplió con todos los umbrales de rendimiento y estabilidad.

### 🎯 Cumplimiento de Objetivos (Thresholds)

| Umbral                    | Criterio                  | Resultado Obtenido | Resultado | Observación                                         |
| :------------------------ | :------------------------ | :----------------- | :-------- | :-------------------------------------------------- |
| Tiempo de Respuesta (P95) | p(95)<1500ms              | 360.32ms           | ✅ OK     | Supera el objetivo con amplio margen.               |
| Tasa de Éxito             | rate > 0.97 (Éxito > 97%) | rate = 100.00%     | ✅ OK     | Todas las validaciones funcionales fueron exitosas. |
| Tasa de Fallo HTTP        | rate < 0.03 (Fallo < 3%)  | rate = 0.00%       | ✅ OK     | No se registró ni un solo fallo HTTP.               |

---

## 🔍 Hallazgos de Pruebas

A pesar de que el resultado general es muy positivo, existe una anomalía clave en las métricas:

### Validación de Status HTTP:

Las validaciones muestran: Status es 201.

Implicación: El servicio de login está devolviendo un código de estado 201 (Created) en lugar del 200 (OK). Aunque es exitoso (porque el token se genera), en servicios de autenticación RESTfull, el código 200 OK es el esperado para una respuesta exitosa, no 201.

## 💻 Conclusiones y Recomendaciones

El servicio de login demostró un rendimiento excelente y una estabilidad perfecta bajo una carga sostenida de $20 \text{ TPS}$. No presenta cuellos de botella en este nivel de carga.

### Recomendaciones Inmediatas:

1. **Ajustar Status Code:** Verificar si el código 201 es intencional. Si no lo es, el equipo de desarrollo debe cambiar la respuesta a 200 (OK) para cumplir con las mejores prácticas de API RESTfull para operaciones de login.

1. **Aumentar la Carga:** Dado el rendimiento sobresaliente, se recomienda escalar la prueba a un nivel más alto (por ejemplo, $50 \text{ TPS}$ o $100 \text{ TPS}$) para identificar el punto de inflexión del sistema.
