# -*- coding: utf-8 -*-
{
    'name': "Mrp workorder temporary fix",
    
    'summary': "",
  
    'license': 'OPL-1',

    'author': "STeSI Consulting",

    'category': '',
  
    'version': '18.0.0.2',
  
    'website': "https://github.com/ingegniamo/mrp_workorder_shopfloor_temporary_fix",

    # any module necessary for this one to work correctly
      'depends': ['stock_barcode', 'mrp_workorder'],
     'assets': {
        'web.assets_backend': [
            'mrp_workorder_shopfloor_temporary_fix/static/src/**/*.js'
        ]
     },
    # always loaded
    'data': [],

    'application': False,
}
