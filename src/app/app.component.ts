import { Component, ViewChild } from '@angular/core';
import CustomStore from 'devextreme/data/custom_store';
import { HttpClient, HttpParams } from '@angular/common/http';
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';
import { DxPivotGridComponent } from 'devextreme-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'devextreme-elastcsearch';


  customDataSource: CustomStore;
  pivotGridData: PivotGridDataSource;

  @ViewChild(DxPivotGridComponent, { static: false }) pivotGrid: DxPivotGridComponent;

  constructor(private http: HttpClient) {
    const isNotEmpty = (value) => value !== undefined && value !== null && value !== '';


    this.customDataSource = new CustomStore({
      key: 'ID',
      cacheRawData: false,
      load: (loadOptions) => {
        let params: HttpParams = new HttpParams();
        [
          'filter',
          'group',
          'groupSummary',
          'parentIds',
          'requireGroupCount',
          'requireTotalCount',
          'searchExpr',
          'searchOperation',
          'searchValue',
          'select',
          'sort',
          'skip',
          'take',
          'totalSummary',
          'userData'
        ].forEach(function (i) {
          if (i in loadOptions && isNotEmpty(loadOptions[i])) {
            params[i] = JSON.stringify(loadOptions[i]);
          }
        });

        const bodySearch = {
          // "query": {
          //   "term": {
          //     "produto": "Produto A"
          //   }
          // }
        }



        // setTimeout(() => {
        //   this.pivotGridData.reload();
        // }, 5000);

        return this.http.post('http://localhost:9200/venda/_search', bodySearch, { params: params })
          .toPromise()
          .then((response: any) => {

            return {
              data: response.hits.hits.map(a => a._source),
              totalCount: response.hits.total.value,
              //summary: response.summary,
              //groupCount: response.groupCount
            };
          })
          .catch(() => { throw 'Data loading error' });
      },
      // Needed to process selected value(s) in the SelectBox, Lookup, Autocomplete, and DropDownBox
      // byKey: (key) => {
      //     return this.http.get('https://mydomain.com/MyDataService?id=' + key)
      //         .toPromise();
      // }
    });

    this.http.get('http://localhost:4200/api/venda/_mapping')
      .toPromise()
      .then((response: any) => {



        this.pivotGrid.fieldChooserChange.subscribe(data => {
          this.pivotGridData.reload();
        })
        const fields = [];

        for (const key in response.venda.mappings.properties) {
          const element = response.venda.mappings.properties[key];

          if (element.type == "double") {
            fields.push({
              caption: key,
              dataField: key,
              dataType: 'number',
              area: 'data',
              summaryType: 'sum',
            });
          } else {
            fields.push({
              caption: key,
              dataField: key,
              area: 'row',
            });
          }


        }

        this.pivotGridData = new PivotGridDataSource({
          fields: fields,
          store: this.customDataSource
        });
      })
      .catch(() => {


        throw 'Data loading error'

      });


  }
}
