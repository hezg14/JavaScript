/*
* Map对象保存键值对，能够记住键值对的插入顺序，
* Object 和 Map相同和区别
*   相同点:
*     都允许按键存取一个值，删除键、检测一个键是否绑定了值。
*   区别：
*     1、Map键可以是任意值，包含函数，对象以及任意的基本数据类型，Object的键必须是个String或者Symbol;
*     2、Map中key值是有序的，迭代时会以插入的顺序返回键值，Object中key也是有序的，但并不总是这样，因此最好不要依赖属性的顺序；
*     3、Map键值对个数可以通过Map.size()获取，Object的键值对个数只能手动计算；
*     4、频繁增删键值对的场景下使用Map性能更好，键值对未频繁增删的场景可使用Object；
*     5、Map没有序列化和解析的支持，Object有原生的支持，序列化（Object-->JSON）使用Object.stringify()，
*     解析（JSON-->Object）使用JSON.parse();
*/