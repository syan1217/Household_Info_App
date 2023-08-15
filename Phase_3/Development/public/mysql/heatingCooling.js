//connection:
const connection = require(__dirname + '/connection.js');

//top manufacturers:
async function getheatingCooling() {

    const query = `
        with cnt_hh_src as (
            select h.household_type,
                   ht.energy_source_h,
                   count(ht.energy_source_h) as cnt
            from household h
                     left join heater ht on h.email = ht.email
            where ht.energy_source_h is not null
            group by h.household_type, ht.energy_source_h),

             max as(
                 select household_type,max(cnt) as max_cnt
                 from cnt_hh_src
                 group by household_type),

             most_common_energy_src as (
                 select max.household_type,energy_source_h from max
                                                                    left join cnt_hh_src on max.household_type=cnt_hh_src.household_type
                 where max.max_cnt = cnt_hh_src.cnt),

             stats as (
                 select h.household_type,count(ac.email) as ac_count,
                        round(avg(case when ac.email is not null then ap.btu_rating end),0) as ac_avg_btu_rating,
                        round(avg(case when ac.email is not null then ac.eer end),1) as ac_avg_eer,
                        count(ht.email) as heater_count,
                        round(avg(case when ht.email is not null then ap.btu_rating end),0) as heater_avg_btu_rating,
                        count(hp.email) as heatpump_count,
                        round(avg(case when hp.email is not null then ap.btu_rating end),0) as heatpump_avg_btu_rating,
                        round(avg(case when hp.email is not null then hp.seer end),1) as avg_seer,
                        round(avg(case when hp.email is not null then hp.hspf end),1) as avg_hspf
                 from Household h
                          left join Appliance ap on h.email = ap.email
                          left join AirConditioner ac on ap.email = ac.email and ap.appliance_order = ac.appliance_order
                          left join heater ht on ap.email = ht.email and ap.appliance_order = ht.appliance_order
                          left join HeatPump hp on ap.email = hp.email and ap.appliance_order = hp.appliance_order
                 group by h.household_type)

        select stats.household_type,ac_count,ac_avg_btu_rating,ac_avg_eer,heater_count,heater_avg_btu_rating,src.energy_source_h as most_common_energy_source,heatpump_count,heatpump_avg_btu_rating,avg_seer,avg_hspf
        from stats
                 left join most_common_energy_src src on stats.household_type = src.household_type
        ;
`;

    return new Promise( function(resolve, reject){
        connection.query(query, function(err, results){
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}


//export the function /property value:
module.exports = {
    getheatingCooling
};