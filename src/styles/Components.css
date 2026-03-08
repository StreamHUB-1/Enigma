@layer components {
  /* ========================================================= */
  /* KODE LAMA LU (Dashboard & Dex Mode)                       */
  /* ========================================================= */
  .dashboard-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
  }
  .dashboard-card {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    height: 140px;
    width: 100%;
    border-radius: 20px;
    color: white;
    cursor: pointer;
    transition: 400ms;
    position: relative;
    overflow: hidden;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    background: linear-gradient(135deg, #7A2828 0%, #A73737 100%);
  }
  .dashboard-card .tip { font-size: 1.2em; font-weight: 800; margin-bottom: 4px; z-index: 10; }
  .dashboard-card .second-text { font-size: 0.8em; opacity: 0.9; z-index: 10; }
  .dashboard-card .icon-bg { position: absolute; right: -10px; bottom: -10px; opacity: 0.2; transform: rotate(-15deg); z-index: 0; }
  .dashboard-card:hover {
    transform: scale(1.05, 1.05);
    z-index: 20;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
  .dashboard-cards:hover > .dashboard-card:not(:hover) {
    filter: blur(4px);
    transform: scale(0.95, 0.95);
    opacity: 0.6;
  }

  .dex-mode { background: white !important; overflow-y: auto !important; overflow-x: hidden !important; }
  .dex-mode header { border-radius: 0; width: 100%; display: flex !important; }
  .dex-mode main { width: 100%; background: white; display: block !important; padding: 2rem; }

  /* ========================================================= */
  /* SLIP GAJI STYLES                                          */
  /* ========================================================= */
  .sg-container {
    width: 800px;
    background-color: #f2f2f2;
    font-family: Arial, sans-serif;
    font-size: 14px;
    color: #000;
    border: 2px solid #000;
    box-sizing: border-box;
    transform: scale(0.9);
    transform-origin: top center;
    margin: 0 auto;
  }
  .sg-header { display: flex; background-color: #8faadc; padding: 5px 10px; border-bottom: 1px solid #000; }
  .sg-company { flex: 1; line-height: 1.4; }
  .sg-title { flex: 1; text-align: center; font-size: 30px; font-weight: bold; letter-spacing: 1px; }
  .sg-emp-info { display: grid; grid-template-columns: 1fr 1fr; padding: 1px 5px; border-bottom: 2px solid #000; }
  .sg-grid-info { display: grid; grid-template-columns: 140px 10px 1fr; row-gap: 5px; align-items: center; }
  .sg-table-header { display: grid; grid-template-columns: 1fr 1fr; background-color: #8faadc; font-weight: bold; text-align: center; border-bottom: 2px solid #000; }
  .sg-col-left { padding: 5px; border-right: 2px solid #000; }
  .sg-col-right { padding: 5px; }
  .sg-table-body { display: grid; grid-template-columns: 1fr 1fr; min-height: 250px; }
  .sg-body-left { padding: 5px; border-right: 2px solid #000; }
  .sg-body-right { padding: 5px; }
  .sg-list { display: grid; grid-template-columns: 150px 10px 1fr; row-gap: 4px; }
  .sg-right-align { text-align: right; font-weight: bold; }
  .sg-total-row { display: grid; grid-template-columns: 1fr 1fr; border-top: 2px solid #000; border-bottom: 2px solid #000; }
  .sg-value-group { display: flex; align-items: center; gap: 8px; }
  .sg-value-group input.editable { width: 120px !important; flex: none !important; }
  .sg-total-left, .sg-total-right { display: flex; justify-content: space-between; align-items: center; padding: 5px 15px; }
  .sg-total-left { border-right: 2px solid #000; }
  .sg-footer { padding: 10px; }
  .sg-thp-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
  .sg-thp-box { display: flex; justify-content: space-between; align-items: center; width: 350px; border: 2px solid #000; padding: 5px 10px; }
  .sg-total-left strong, .sg-total-right strong, .sg-thp-box strong { white-space: nowrap; }
  .sg-accident-box { display: grid; grid-template-columns: 100px 10px 30px 1fr; width: 350px; align-items: center; }
  .sg-bpjs-info { margin-bottom: 25px; }
  .sg-signatures { display: flex; justify-content: space-between; align-items: flex-end; }
  .sg-bank-info { width: 350px; }
  .sg-sign-box { display: flex; flex-direction: column; justify-content: space-between; align-items: center; height: 100px; width: 200px; }
  .sg-sign-title { text-align: center; }
  .sg-sign-name { font-weight: bold; text-align: center; }
  .fw-bold { font-weight: bold !important; }

  input.editable { width: 100%; box-sizing: border-box; background: transparent; border: none; font-family: inherit; font-size: inherit; color: inherit; padding: 0; margin: 0; outline: none; pointer-events: none; }

  #sg-editToggle:checked ~ .sg-container input.editable { pointer-events: auto; background-color: #09ff0038; border-bottom: 1px dashed #000; padding: 0 4px; }

  .sg-edit-button { width: 40px; height: 40px; border-radius: 50%; background-color: rgb(20, 20, 20); border: none; font-weight: 600; display: flex; align-items: center; justify-content: center; box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.164); cursor: pointer; color: white; position: absolute; bottom: 10px; right: 10px; overflow: hidden; text-decoration: none !important; z-index: 100; transition-duration: 0.3s; }
  .sg-edit-svgIcon { width: 17px; transition-duration: 0.3s; }
  .sg-edit-svgIcon path { fill: white; }
  .sg-edit-button:hover { width: 70px; border-radius: 50px; background-color: rgb(255, 69, 69); transition-duration: 0.3s; }
  .sg-edit-button:hover .sg-edit-svgIcon { width: 20px; transform: rotate(360deg); transition-duration: 0.3s; }
  .sg-edit-button::before { display: none; content: "Edit"; font-size: 2px; transition-duration: 0.3s; }
  .sg-edit-button:hover::before { display: block; padding-right: 5px; font-size: 13px; opacity: 1; transform: translateY(0px); }

  #sg-editToggle:checked ~ .sg-edit-button { background-color: rgb(22, 163, 74) !important; width: 85px; border-radius: 50px; }
  #sg-editToggle:checked ~ .sg-edit-button::before { content: "Simpan" !important; display: block !important; padding-right: 5px; font-size: 13px; opacity: 1; }
  #sg-editToggle:checked ~ .sg-edit-button .sg-edit-svgIcon { display: none; }

  /* ========================================================= */
  /* SALDO KOKAS STYLES                                        */
  /* ========================================================= */
  .document-wrapper { position: relative; width: 700px; margin: 20px auto; font-family: Arial, Helvetica, sans-serif; color: #000; transform: scale(0.95); transform-origin: top center; }
  .kokas-container { background-color: #fff; border: 2px solid #000; display: flex; flex-direction: column; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); font-size: 14px; }
  .header-title { background-color: #002060; color: #fff; text-align: center; font-weight: bold; padding: 6px 0; font-size: 15px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #000; }
  .sub-header { display: grid; grid-template-columns: 1fr 1fr; background-color: #002060; color: #fff; font-weight: bold; border-bottom: 2px solid #000; }
  .sub-header-col { padding: 4px 12px; }
  .border-right { border-right: 2px solid #000; }
  .info-grid { padding: 5px; display: grid; grid-template-columns: 120px 10px 1fr; row-gap: 0px; font-weight: 600; border-bottom: 2px solid #000; align-items: center; }
  .content-body { display: grid; grid-template-columns: 1fr 1fr; font-weight: 600; min-height: 250px; }
  .col-padding { padding: 5px; display: flex; flex-direction: column; gap: 2px; }
  .data-row { display: flex; align-items: center; }
  .label-left { width: 140px; }
  .label-right { width: 120px; }
  .colon { width: 15px; }
  .value-group { flex: 1; display: flex; align-items: center; padding-right: 20px; }
  .rp-symbol { margin-right: 8px; }
  .spacer-row { height: 16px; }
  .footer-total { display: grid; grid-template-columns: 1fr 1fr; background-color: #002060; color: #fff; font-weight: bold; border-top: 2px solid #000; border-bottom: 2px solid #000; }
  .footer-col { padding: 8px 12px; display: flex; align-items: center; }
  .ttd-section { padding: 12px; padding-top: 24px; height: 120px; position: relative; font-weight: 600; }
  .ttd-box { position: absolute; bottom: 12px; left: 12px; display: flex; flex-direction: column; }
  .ttd-space { height: 48px; }

  .document-wrapper [type="number"]::-webkit-inner-spin-button, .document-wrapper [type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
  .editable-input { width: 100%; box-sizing: border-box; background: transparent; border: none; border-bottom: 1px solid transparent; font-family: inherit; font-size: inherit; color: inherit; padding: 0; margin: 0; outline: none; pointer-events: none; transition: all 0.2s ease-in-out; }
  .align-right { text-align: right; font-weight: bold; }
  .mw-200 { max-width: 200px; }
  .mw-350 { max-width: 350px; }

  #kokas-editToggle:checked ~ .kokas-container .editable-input { pointer-events: auto; background-color: #09ff0038; border-bottom: 1px dashed #000; padding: 0 4px; }
  #kokas-editToggle:checked ~ .kokas-container .footer-total .editable-input { color: #000; }

  .kokas-edit-button { width: 40px; height: 40px; border-radius: 50%; background-color: rgb(20, 20, 20); border: none; font-weight: 600; display: flex; align-items: center; justify-content: center; box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.164); cursor: pointer; color: white; position: absolute; bottom: 6px; right: 6px; overflow: hidden; text-decoration: none !important; z-index: 100; transition-duration: 0.3s; }
  .kokas-edit-svgIcon { width: 17px; transition-duration: 0.3s; }
  .kokas-edit-svgIcon path { fill: white; }
  .kokas-edit-button:hover { width: 70px; border-radius: 50px; background-color: rgb(255, 69, 69); transition-duration: 0.3s; }
  .kokas-edit-button:hover .kokas-edit-svgIcon { width: 20px; transform: rotate(360deg); transition-duration: 0.3s; }
  .kokas-edit-button::before { display: none; content: "Edit"; font-size: 2px; transition-duration: 0.3s; }
  .kokas-edit-button:hover::before { display: block; padding-right: 5px; font-size: 13px; opacity: 1; transform: translateY(0px); }

  #kokas-editToggle:checked ~ .kokas-edit-button { background-color: rgb(22, 163, 74) !important; width: 85px; border-radius: 50px; }
  #kokas-editToggle:checked ~ .kokas-edit-button::before { content: "Simpan" !important; display: block !important; padding-right: 5px; font-size: 13px; opacity: 1; }
  #kokas-editToggle:checked ~ .kokas-edit-button .kokas-edit-svgIcon { display: none; }

  /* ========================================================= */
  /* FORM CUTI STYLES                                          */
  /* ========================================================= */
  .fc-wrapper { position: relative; width: 800px; margin: 20px auto; font-family: Arial, Helvetica, sans-serif; color: #000; transform: scale(0.9); transform-origin: top center; }
  .fc-container { background-color: #fff; padding: 20px 30px; display: flex; flex-direction: column; font-size: 14px; box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05); border: 2px solid #000; }
  .fc-header { display: flex; justify-content: space-between; align-items: flex-end; padding-bottom: 8px; }
  .fc-header-left { flex: 1; font-size: 18px; font-weight: bold; }
  .fc-header-center { flex: 1; display: flex; justify-content: center; align-items: center; }
  .fc-header-right { flex: 1; display: flex; justify-content: flex-end; align-items: center; }
  .fc-space-mx { margin: 0 6px; }
  .fc-line { border-bottom: 2px solid #000; margin: 4px 0 8px 0; }
  .fc-body-container { display: grid; grid-template-columns: 1fr 1fr; column-gap: 30px; row-gap: 0px; margin-bottom: 20px; }
  .fc-item { display: grid; grid-template-columns: 130px 10px 1fr; align-items: start; margin-bottom: 5px; }
  .fc-label { font-weight: normal; }
  .fc-colon { text-align: center; }
  .fc-val { width: 100%; }
  .fc-val-group { display: flex; align-items: center; gap: 8px; }
  .fc-signatures { display: flex; justify-content: space-between; margin-top: 10px; }
  .fc-sign-box { display: flex; flex-direction: column; align-items: center; justify-content: space-between; height: 120px; width: 30%; text-align: center; }
  .fc-sign-title { font-weight: normal; }
  .fc-sign-bottom { display: flex; align-items: center; justify-content: center; width: 100%; }

  .fc-wrapper [type="number"]::-webkit-inner-spin-button, .fc-wrapper [type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
  .fc-editable-input { width: 100%; box-sizing: border-box; background: transparent; border: none; border-bottom: 1px solid transparent; font-family: inherit; font-size: inherit; color: inherit; padding: 0; margin: 0; outline: none; pointer-events: none; transition: all 0.2s ease-in-out; }
  .fc-textarea { resize: none; overflow: hidden; line-height: 1.4; width: 100%; border: none; background: transparent; pointer-events: none; outline: none; }
  .fc-fw-bold { font-weight: bold !important; }
  .fc-w-120 { width: 120px !important; }
  .fc-w-100 { width: 100px !important; }
  .fc-w-30 { width: 30px !important; text-align: center; }
  .fc-sign-input { width: 180px; text-align: center; }

  #fc-editToggle:checked ~ .fc-container .fc-editable-input, #fc-editToggle:checked ~ .fc-container .fc-textarea { pointer-events: auto; background-color: #09ff0038; border-bottom: 1px dashed #000; padding: 2px 4px; }

  .fc-edit-button { width: 40px; height: 40px; border-radius: 50%; background-color: rgb(20, 20, 20); border: none; font-weight: 600; display: flex; align-items: center; justify-content: center; box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.164); cursor: pointer; color: white; position: absolute; bottom: 6px; right: 6px; overflow: hidden; text-decoration: none !important; z-index: 100; transition-duration: 0.3s; }
  .fc-edit-svgIcon { width: 17px; transition-duration: 0.3s; }
  .fc-edit-svgIcon path { fill: white; }
  .fc-edit-button:hover { width: 70px; border-radius: 50px; background-color: rgb(255, 69, 69); transition-duration: 0.3s; }
  .fc-edit-button:hover .fc-edit-svgIcon { width: 20px; transform: rotate(360deg); transition-duration: 0.3s; }
  .fc-edit-button::before { display: none; content: "Edit"; font-size: 2px; transition-duration: 0.3s; }
  .fc-edit-button:hover::before { display: block; padding-right: 5px; font-size: 13px; opacity: 1; transform: translateY(0px); }

  #fc-editToggle:checked ~ .fc-edit-button { background-color: rgb(22, 163, 74) !important; width: 85px; border-radius: 50px; }
  #fc-editToggle:checked ~ .fc-edit-button::before { content: "Simpan" !important; display: block !important; padding-right: 5px; font-size: 13px; opacity: 1; }
  #fc-editToggle:checked ~ .fc-edit-button .fc-edit-svgIcon { display: none; }
}
