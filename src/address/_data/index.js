

import province from "./_province.json"
import city from "./_city.json"
import area from "./_area.json"

function getAreaList(provinceCode, cityCode) {
    // children
    return area.filter(item => {
        return item.provinceCode == provinceCode && item.cityCode == cityCode
    }).map(item => {
        return {
            code: item.code,
            value: item.name,
            label: item.name,
        }
    })
}

function getCityList(provinceCode) {
    return city.filter(item => {
        return item.provinceCode == provinceCode
    }).map(item => {
        let children = getAreaList(item.provinceCode, item.code)
        if (children.length > 0) {
            return {
                code: item.code,
                value: item.name,
                label: item.name,
                children
            }
        } else {
            return {
                code: item.code,
                value: item.name,
                label: item.name,
            }
        }
    })
}

export function getData() {
    return province.map(item => {
        let children = getCityList(item.code)
        if (children.length > 0) {
            return {
                code: item.code,
                value: item.name,
                label: item.name,
                children
            }
        } else {
            return {
                code: item.code,
                value: item.name,
                label: item.name,
            }
        }
    })
}