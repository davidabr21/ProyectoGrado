# backend/main.py
from fastapi import FastAPI, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import pandas as pd
import plotly.express as px
import io
import subprocess
import tempfile
import sys
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # O ajusta a tu frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/run-python-script")
async def run_python_script(pythonScript: UploadFile):
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".py") as temp_py:
            temp_py.write(await pythonScript.read())
            temp_py.flush()
            # Ejecuta el script Python
            result = subprocess.run(
                [sys.executable, temp_py.name],
                capture_output=True,
                text=True
            )
            if result.returncode != 0:
                return JSONResponse(content={"error": result.stderr}, status_code=400)
            
            output = json.loads(result.stdout)
            return output

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
    

    # Un ejemplo de script que el usuario podría subir
#import pandas as pd
#import plotly.express as px
#import json

#df = pd.DataFrame({"A": [1, 2, 3], "B": [4, 5, 6]})
#fig = px.bar(df, x='A', y='B')

#output = {
#    "data": df.to_dict(orient='records'),
#    "plots": [{
#        "data": fig.to_dict()['data'],
#        "layout": fig.to_dict()['layout']
#    }]
#}

#print(json.dumps(output))