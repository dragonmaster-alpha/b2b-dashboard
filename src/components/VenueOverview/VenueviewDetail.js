import React, { Component } from 'react';
import { Breakpoint } from 'react-socks';
import '../../assets/scss/overviewdetail.scss';
import { Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import { Line } from 'react-chartjs-2';

import { format, subDays } from 'date-fns';
import {
    CircularProgressbar,
  } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import App from "./VenueApp"


export default function VenueviewDetail() {
  const { t, i18n } = useTranslation();
  return (
    <>
        <Breakpoint medium>
        <div className="main_content">
          <div className="venue_list">
            <Card className="venue_card">
              <span className="sensor_name">awair-omni_8731</span>
              <div className="main_area">
                <CircularProgressbar className="a1" value={72} text={72} />
                <div className="unit">
                    <img
                      className="symbol_img"
                      src={require('assets/img/element/settings/great.png').default}
                      alt="..."
                    />
                    <div className="temp">Temp</div>
                    <div className="number">18.8</div>
                    <div className="index">°C</div>
                </div>
                <div className="unit">
                    <img
                      className="symbol_img"
                      src={require('assets/img/element/settings/poor.png').default}
                      alt="..."
                    />
                    <div className="temp">{t('humidity')}</div>
                    <div className="number">63</div>
                    <div className="index">%</div>
                </div>
                <div className="unit">
                    <img
                      className="symbol_img"
                      src={require('assets/img/element/settings/acceptable.png').default}
                      alt="..."
                    />
                    <div className="temp">CO<sub>2</sub></div>
                    <div className="number">1360</div>
                    <div className="index">ppm</div>
                </div>
                <div className="unit">
                    <img
                      className="symbol_img"
                      src={require('assets/img/element/settings/good.png').default}
                      alt="..."
                    />
                    <div className="temp">TVOCs</div>
                    <div className="number">929</div>
                    <div className="index">ppb</div>
                </div>
                <div className="unit">
                    <img
                      className="symbol_img"
                      src={require('assets/img/element/settings/acceptable.png').default}
                      alt="..."
                    />
                    <div className="temp">PM2.5</div>
                    <div className="number">11</div>
                    <div className="index">ug/m<sup>3</sup></div>
                </div>
              </div>
            </Card>
            <div className="timeline_div">
                <span className="timeline_title">{t('timeline')}</span>
                <div className="button_div">
                    <div className="datepicker">
                        <i className="far fa-calendar-alt"></i>
                        <DateRangePicker
                        initialSettings={{
                            startDate: '12/17/2020',
                            endDate: '1/11/2021'
                        }}
                        >
                        <input type="text" className="form-control" />
                        </DateRangePicker>
                        <span className="datepicker-icon nc-icon nc-stre-down"></span>
                    </div>
                    <div className="button_area">                
                        <span className="interval">{t('interval')} :</span>
                        <span className="hour">2 hr</span>
                    </div>
                </div>
                <div className="timeline_detail">
                    <span className="camera_span">{t('camera')}2018_...</span>
                    <span className="venue_span">ufficio_16736</span>
                </div>
            </div>
        
            <div className="chart">
                <App />
            </div>
            <div className="chart">
                <App />
            </div>
        
          </div>
        </div>
      </Breakpoint>
      <Breakpoint small down>
        <div className="main_content">
          <div className="venue_list">
            <Card className="venue_card">
              <span className="sensor_name">awair-omni_8731</span>
              <div className="main_area">
                <CircularProgressbar className="a1" value={72} text={72} />
                <div className="unit">
                    <img
                      className="symbol_img"
                      src={require('assets/img/element/settings/great.png').default}
                      alt="..."
                    />
                    <div className="temp">Temp</div>
                    <div className="number">18.8</div>
                    <div className="index">°C</div>
                </div>
                <div className="unit">
                    <img
                      className="symbol_img"
                      src={require('assets/img/element/settings/poor.png').default}
                      alt="..."
                    />
                    <div className="temp">{t('humidity')}</div>
                    <div className="number">63</div>
                    <div className="index">%</div>
                </div>
                <div className="unit">
                    <img
                      className="symbol_img"
                      src={require('assets/img/element/settings/acceptable.png').default}
                      alt="..."
                    />
                    <div className="temp">CO<sub>2</sub></div>
                    <div className="number">1360</div>
                    <div className="index">ppm</div>
                </div>
                <div className="unit">
                    <img
                      className="symbol_img"
                      src={require('assets/img/element/settings/good.png').default}
                      alt="..."
                    />
                    <div className="temp">TVOCs</div>
                    <div className="number">929</div>
                    <div className="index">ppb</div>
                </div>
                <div className="unit">
                    <img
                      className="symbol_img"
                      src={require('assets/img/element/settings/acceptable.png').default}
                      alt="..."
                    />
                    <div className="temp">PM2.5</div>
                    <div className="number">11</div>
                    <div className="index">ug/m<sup>3</sup></div>
                </div>
              </div>
            </Card>
            <div className="timeline_div">
                <span className="timeline_title">{t('timeline')}</span>
                <div className="button_div">
                    <div className="datepicker">
                        <i className="far fa-calendar-alt"></i>
                        <DateRangePicker
                        initialSettings={{
                            startDate: '12/17/2020',
                            endDate: '1/11/2021'
                        }}
                        >
                        <input type="text" className="form-control" />
                        </DateRangePicker>
                        <span className="datepicker-icon nc-icon nc-stre-down"></span>
                    </div>
                    <div className="button_area">                
                        <span className="interval">{t('interval')} :</span>
                        <span className="hour">2 hr</span>
                    </div>
                </div>
                <div className="timeline_detail">
                    <span className="camera_span">{t('camera')}2018_...</span>
                    <span className="venue_span">ufficio_16736</span>
                </div>
            </div>
        
            <div className="chart">
                <App />
            </div>
            <div className="chart">
                <App />
            </div>
        
          </div>
        </div>
      </Breakpoint>
    </>
  );
}
