module.exports =(temp,product)=>{
let output = temp.replace(/{%PRODUCTNAME%}/g,product.name)
return output
}