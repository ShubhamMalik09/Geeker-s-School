import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { apiConnector } from '../services/apiconnector';
import { categories } from '../services/api';
import getCatalogPageData from '../services/operations/pageAndComponentData';

const Catalog = () => {

    const {catalogName} = useParams();
    const [catalogPageData , setCatalogPageData] = useState(null);
    const [categoryId, setCategoryId] = useState("");

    useEffect(()=>{
        const getCategories = async() =>{
            const res = await apiConnector("GET",categories.CATEGORIES_API);
            const category_id = res?.data?.data?.filter((ct) => ct.name.split(" ").join("-").toLoweCase() === catalogName)[0]._id;
            setCategoryId(category_id);
        }
        getCategories();
    },[catalogName]);

    useEffect(()=>{
        const getCategoryDetails = async() =>{
            try{
                const res = await getCatalogPageData(categoryId);
                setCatalogPageData(res);
            } catch(err){
                console.log(err)
            } 
        }
        getCategoryDetails();
    },[categoryId]);
    return (
    <div>
      <div>
        <p>
            {"Home / Catalog / "}
            <span>
                {catalogPageData?.data?.selectedCategory?.name}
            </span>
        </p>
        <p>{catalogPageData?.data?.selectedCategory?.name}</p>
        <p>{catalogPageData?.data?.selectedCategory?.description}</p>
      </div>

      <div>
        {/* section 1 */}
        <div>
            <div>Courses to get you started</div>
            <div>
                <p>Most Popular</p>
                <p>New</p>
            </div>
            <div>
                <CourseSlider
                    Courses={catalogPageData?.data?.selectedCategory?.courses}
                />
            </div>
        </div>

        {/* section2 */}
        <div>
            <div>Top Courses in {catalogPageData?.data?.selectedCategory?.name}</div>
            <div>
                <CourseSlider Courses={catalogPageData?.data?.differentCategory?.courses}/>
            </div>
        </div>

        {/* section3 */}
        <div>
            <div>Frequently Bought</div>
            <div>
                <div className='grid grid-cols-1 lg:grid-cols-2'>
                    {
                        catalogPageData?.data?.mostSellingCourses?.slice(0,4)
                        .map((course,index) =>{
                            <CourseCard course={course} key={index} Height={"400px "}/>
                        })
                    }
                </div>
            </div>
        </div>
      </div>

      <Footer/>
    </div>
  )
}

export default Catalog
