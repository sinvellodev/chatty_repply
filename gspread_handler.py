import gspread
from google.oauth2.service_account import Credentials
from datetime import datetime

# Configuración de gspread
scope = ['https://spreadsheets.google.com/feeds', 'https://www.googleapis.com/auth/drive']
creds = Credentials.from_service_account_file('proyecto-eva-service-account.json', scopes=scope)
client = gspread.authorize(creds)

# Abre la hoja de cálculo (reemplaza 'ID_DE_TU_SPREADSHEET' con el ID real de tu hoja)
sheet = client.open_by_key('1qWlfX_inOnDdK5GtJzX3n_0dutbnEYssEjuR9yudN-o').sheet1

def save_to_sheet(thread_id, question, response):
    date_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    sheet.append_row([thread_id, question, response, date_time])